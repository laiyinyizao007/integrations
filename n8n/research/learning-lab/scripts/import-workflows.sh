#!/bin/bash

# n8n工作流导入脚本
# 用于批量导入示例工作流到n8n实例

set -e

echo "📥 n8n工作流导入工具"
echo "======================="

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
N8N_URL="http://localhost:5678"
WORKFLOWS_DIR="$PROJECT_ROOT/workflows"

# 默认凭据
N8N_USER="admin"
N8N_PASS="avery_n8n_2025"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 登录获取token
login_and_get_token() {
    echo "🔐 登录到 n8n..."

    # 尝试登录获取token
    LOGIN_RESPONSE=$(curl -s -X POST "$N8N_URL/rest/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$N8N_USER\",\"password\":\"$N8N_PASS\"}")

    # 检查登录是否成功
    if echo "$LOGIN_RESPONSE" | grep -q "token"; then
        TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
        echo "✅ 登录成功"
        echo "$TOKEN"
    else
        echo -e "${RED}❌ 登录失败${NC}"
        echo "响应: $LOGIN_RESPONSE"
        echo ""
        echo "请确保:"
        echo "1. n8n 服务正在运行: $N8N_URL"
        echo "2. 用户名和密码正确"
        echo "3. 可以访问 n8n 界面确认凭据"
        exit 1
    fi
}

# 导入单个工作流
import_workflow() {
    local workflow_file="$1"
    local workflow_name=$(basename "$workflow_file" .json)

    echo -e "${BLUE}📄 导入工作流: $workflow_name${NC}"

    # 读取工作流JSON
    if [ ! -f "$workflow_file" ]; then
        echo -e "${RED}❌ 找不到工作流文件: $workflow_file${NC}"
        return 1
    fi

    # 读取并验证JSON
    WORKFLOW_JSON=$(cat "$workflow_file")
    if ! echo "$WORKFLOW_JSON" | jq . > /dev/null 2>&1; then
        echo -e "${RED}❌ 无效的JSON文件: $workflow_file${NC}"
        return 1
    fi

    # 导入工作流
    IMPORT_RESPONSE=$(curl -s -X POST "$N8N_URL/rest/workflows" \
        -H "Content-Type: application/json" \
        -H "X-N8N-API-KEY: $TOKEN" \
        -d "$WORKFLOW_JSON")

    # 检查导入结果
    if echo "$IMPORT_RESPONSE" | grep -q '"id":'; then
        WORKFLOW_ID=$(echo "$IMPORT_RESPONSE" | jq -r '.id')
        echo -e "${GREEN}✅ 导入成功 - ID: $WORKFLOW_ID${NC}"

        # 激活工作流（如果有webhook触发器）
        if echo "$WORKFLOW_JSON" | jq -r '.nodes[] | select(.type | contains("webhook"))' | grep -q "webhook"; then
            echo "🔄 激活工作流..."
            ACTIVATE_RESPONSE=$(curl -s -X POST "$N8N_URL/rest/workflows/$WORKFLOW_ID/activate" \
                -H "X-N8N-API-KEY: $TOKEN")

            if echo "$ACTIVATE_RESPONSE" | grep -q "success\|true"; then
                echo -e "${GREEN}✅ 工作流已激活${NC}"
            else
                echo -e "${YELLOW}⚠️  工作流激活失败，但导入成功${NC}"
            fi
        fi

        return 0
    else
        echo -e "${RED}❌ 导入失败${NC}"
        echo "响应: $IMPORT_RESPONSE"
        return 1
    fi
}

# 扫描工作流文件
scan_workflow_files() {
    local base_dir="$1"
    local pattern="$2"

    echo "🔍 扫描工作流文件..."
    echo "目录: $base_dir"
    echo "模式: $pattern"
    echo ""

    # 查找所有JSON文件
    find "$base_dir" -name "$pattern" -type f | sort
}

# 显示工作流列表
show_workflow_list() {
    local base_dir="$1"

    echo "📋 可用的工作流："
    echo ""

    # 基础工作流
    if [ -d "$base_dir/basics" ]; then
        echo "🟢 基础工作流 (推荐新手):"
        scan_workflow_files "$base_dir/basics" "*.json" | while read -r file; do
            name=$(basename "$file" .json | sed 's/-/ /g' | sed 's/\b\w/\U&/g')
            echo "  • $name"
        done
        echo ""
    fi

    # 集成工作流
    if [ -d "$base_dir/integrations" ]; then
        echo "🟡 集成工作流 (第三方服务):"
        scan_workflow_files "$base_dir/integrations" "*.json" | while read -r file; do
            name=$(basename "$file" .json | sed 's/-/ /g' | sed 's/\b\w/\U&/g')
            echo "  • $name"
        done
        echo ""
    fi

    # 自动化工作流
    if [ -d "$base_dir/automation" ]; then
        echo "🟠 自动化工作流 (实际应用):"
        scan_workflow_files "$base_dir/automation" "*.json" | while read -r file; do
            name=$(basename "$file" .json | sed 's/-/ /g' | sed 's/\b\w/\U&/g')
            echo "  • $name"
        done
        echo ""
    fi

    # 高级工作流
    if [ -d "$base_dir/advanced" ]; then
        echo "🔴 高级工作流 (复杂功能):"
        scan_workflow_files "$base_dir/advanced" "*.json" | while read -r file; do
            name=$(basename "$file" .json | sed 's/-/ /g' | sed 's/\b\w/\U&/g')
            echo "  • $name"
        done
        echo ""
    fi
}

# 导入指定类别的工作流
import_category() {
    local category="$1"
    local category_dir="$WORKFLOWS_DIR/$category"

    if [ ! -d "$category_dir" ]; then
        echo -e "${YELLOW}⚠️  找不到类别目录: $category_dir${NC}"
        return 1
    fi

    echo -e "${BLUE}📂 导入 $category 类别的工作流${NC}"
    echo ""

    local success_count=0
    local total_count=0

    for workflow_file in "$category_dir"/*.json; do
        if [ -f "$workflow_file" ]; then
            total_count=$((total_count + 1))
            if import_workflow "$workflow_file"; then
                success_count=$((success_count + 1))
            fi
            echo ""
        fi
    done

    echo -e "${GREEN}📊 $category 导入完成: $success_count/$total_count 成功${NC}"
}

# 导入所有工作流
import_all_workflows() {
    echo -e "${BLUE}🚀 开始导入所有工作流${NC}"
    echo ""

    local total_success=0
    local total_count=0

    for category_dir in "$WORKFLOWS_DIR"/*/; do
        if [ -d "$category_dir" ]; then
            category=$(basename "$category_dir")

            echo -e "${YELLOW}📂 处理类别: $category${NC}"

            local category_success=0
            local category_count=0

            for workflow_file in "$category_dir"/*.json; do
                if [ -f "$workflow_file" ]; then
                    category_count=$((category_count + 1))
                    total_count=$((total_count + 1))

                    if import_workflow "$workflow_file"; then
                        category_success=$((category_success + 1))
                        total_success=$((total_success + 1))
                    fi
                    echo ""
                fi
            done

            echo -e "${GREEN}📊 $category: $category_success/$category_count 成功${NC}"
            echo ""
        fi
    done

    echo -e "${GREEN}🎉 全部导入完成: $total_success/$total_count 成功${NC}"
}

# 检查n8n服务状态
check_n8n_status() {
    echo "🔍 检查 n8n 服务状态..."

    if ! curl -s --max-time 5 "$N8N_URL" > /dev/null; then
        echo -e "${RED}❌ 无法连接到 n8n 服务${NC}"
        echo ""
        echo "请确保:"
        echo "1. n8n 服务正在运行"
        echo "2. 访问地址正确: $N8N_URL"
        echo "3. 网络连接正常"
        echo ""
        echo "启动命令:"
        echo "  cd ../Averivendell_n8n && ./start.sh"
        exit 1
    fi

    echo -e "${GREEN}✅ n8n 服务运行正常${NC}"
}

# 显示使用帮助
show_help() {
    echo "使用方法:"
    echo "  $0 [选项] [类别]"
    echo ""
    echo "选项:"
    echo "  -h, --help          显示此帮助信息"
    echo "  -l, --list          列出所有可用的工作流"
    echo "  -a, --all           导入所有工作流"
    echo "  -c, --category CAT  导入指定类别的所有工作流"
    echo "  -f, --file FILE     导入指定的单个工作流文件"
    echo ""
    echo "类别:"
    echo "  basics      基础工作流"
    echo "  integrations 第三方服务集成"
    echo "  automation  自动化场景"
    echo "  advanced    高级功能"
    echo ""
    echo "示例:"
    echo "  $0 --list                    # 列出所有工作流"
    echo "  $0 --all                     # 导入所有工作流"
    echo "  $0 --category basics         # 导入基础工作流"
    echo "  $0 --file path/to/workflow.json  # 导入单个工作流"
    echo ""
    echo "默认行为: 导入基础工作流 (适合新手)"
}

# 主函数
main() {
    # 检查参数
    case "${1:-}" in
        -h|--help)
            show_help
            exit 0
            ;;
        -l|--list)
            show_workflow_list "$WORKFLOWS_DIR"
            exit 0
            ;;
        -a|--all)
            ACTION="all"
            ;;
        -c|--category)
            if [ -z "$2" ]; then
                echo -e "${RED}❌ 请指定类别名称${NC}"
                exit 1
            fi
            ACTION="category"
            CATEGORY="$2"
            ;;
        -f|--file)
            if [ -z "$2" ]; then
                echo -e "${RED}❌ 请指定工作流文件路径${NC}"
                exit 1
            fi
            ACTION="file"
            WORKFLOW_FILE="$2"
            ;;
        "")
            # 默认导入基础工作流
            ACTION="category"
            CATEGORY="basics"
            ;;
        *)
            echo -e "${RED}❌ 无效选项: $1${NC}"
            echo ""
            show_help
            exit 1
            ;;
    esac

    # 检查依赖
    if ! command -v curl &> /dev/null; then
        echo -e "${RED}❌ 需要安装 curl${NC}"
        exit 1
    fi

    if ! command -v jq &> /dev/null; then
        echo -e "${RED}❌ 需要安装 jq${NC}"
        exit 1
    fi

    # 检查n8n服务
    check_n8n_status
    echo ""

    # 登录获取token
    TOKEN=$(login_and_get_token)
    echo ""

    # 执行导入操作
    case "$ACTION" in
        all)
            import_all_workflows
            ;;
        category)
            import_category "$CATEGORY"
            ;;
        file)
            if [ ! -f "$WORKFLOW_FILE" ]; then
                echo -e "${RED}❌ 找不到工作流文件: $WORKFLOW_FILE${NC}"
                exit 1
            fi
            import_workflow "$WORKFLOW_FILE"
            ;;
    esac

    echo ""
    echo -e "${GREEN}🎊 工作流导入完成！${NC}"
    echo ""
    echo "💡 提示:"
    echo "• 打开浏览器访问: $N8N_URL"
    echo "• 查看导入的工作流"
    echo "• 点击 'Execute Workflow' 测试运行"
    echo "• 查看 'Executions' 了解执行历史"
}

# 检查是否直接运行脚本
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
