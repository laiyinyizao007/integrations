#!/usr/bin/env python3
"""
n8n GCP 自动化部署脚本
基于 danielraffel/n8n-gcp 项目，添加了中文支持和优化
"""

import subprocess
import json
import os
import argparse
import sys

# ========== 全局配置变量 ==========
# 必填项
n8n_hostname = "n8n.YOURDOMAIN.COM"  # 必填。示例: n8n.example.com
ssh_key = "user_name:ssh-rsa YOUR_SSH_KEY_STRING"  # 必填。你的 SSH 公钥
ssh_private_key_path = "/home/YOUR_USERNAME/.ssh/gcp"  # 必填。SSH 私钥路径
ssh_user = "your_username"  # 必填。SSH 用户名

# 可选项（根据需要修改）
webhook_url = f"https://{n8n_hostname}/"  # Webhook URL，默认使用 n8n_hostname
fastapi_docker_image = "tiangolo/uvicorn-gunicorn-fastapi:python3.11"  # FastAPI Docker 镜像
region = "asia-east1"  # GCP 区域，默认香港（可改为 us-west1 等）
zone = f"{region}-a"  # GCP 可用区

# ========== 工具函数 ==========

def print_step(message):
    """打印步骤信息"""
    print(f"\n{'='*60}")
    print(f">>> {message}")
    print(f"{'='*60}\n")

def check_prerequisites():
    """检查必要的工具是否已安装"""
    print_step("检查前置条件")
    
    tools = {
        "gcloud": "Google Cloud SDK",
        "terraform": "Terraform",
        "python3": "Python 3"
    }
    
    missing_tools = []
    for tool, name in tools.items():
        result = subprocess.run(["which", tool], capture_output=True)
        if result.returncode != 0:
            missing_tools.append(name)
            print(f"❌ {name} 未安装")
        else:
            print(f"✅ {name} 已安装")
    
    if missing_tools:
        print(f"\n⚠️  缺少以下工具: {', '.join(missing_tools)}")
        print("请先安装这些工具再继续。")
        sys.exit(1)
    
    print("\n✅ 所有前置条件满足")

def fetch_project_id():
    """获取 GCP 项目 ID"""
    print_step("获取 GCP 项目 ID")
    result = subprocess.run(
        ["gcloud", "config", "get-value", "project"],
        capture_output=True,
        text=True
    )
    project_id = result.stdout.strip()
    print(f"项目 ID: {project_id}")
    return project_id

def fetch_service_account_key():
    """获取或创建服务账号密钥"""
    print_step("处理服务账号密钥")
    
    # 获取服务账号列表
    accounts = subprocess.run(
        ["gcloud", "iam", "service-accounts", "list", "--format=json"],
        capture_output=True,
        text=True
    )
    accounts_json = json.loads(accounts.stdout)

    # 查找 Compute Engine 默认服务账号
    compute_engine_service_account = None
    for account in accounts_json:
        if 'Compute Engine default service account' in account.get('displayName', ''):
            compute_engine_service_account = account["email"]
            break

    if not compute_engine_service_account:
        print("❌ 未找到 Compute Engine 默认服务账号")
        return None

    print(f"找到服务账号: {compute_engine_service_account}")

    # 创建服务账号密钥
    key_filename = "service-account-key.json"
    create_key_result = subprocess.run(
        [
            "gcloud", "iam", "service-accounts", "keys", "create",
            key_filename,
            "--iam-account", compute_engine_service_account
        ],
        capture_output=True,
        text=True
    )

    if create_key_result.returncode != 0:
        print(f"❌ 创建服务账号密钥失败: {create_key_result.stderr}")
        return None

    print(f"✅ 服务账号密钥已创建: {key_filename}")
    return key_filename

def format_hostname(hostname):
    """格式化主机名以符合 GCP 命名规范"""
    return hostname.replace('.', '-')

def check_static_ip(hostname, region):
    """检查或创建静态 IP"""
    print_step("处理静态 IP")
    formatted_hostname = format_hostname(hostname)
    
    # 检查静态 IP 是否存在
    result = subprocess.run(
        [
            "gcloud", "compute", "addresses", "list",
            f"--filter=NAME={formatted_hostname} AND region:{region}",
            "--format=json"
        ],
        capture_output=True,
        text=True
    )
    
    if result.returncode != 0:
        print(f"❌ 列出静态 IP 失败: {result.stderr}")
        return None, None

    addresses = json.loads(result.stdout)
    for address in addresses:
        if address["name"] == formatted_hostname:
            ip = address["address"]
            print(f"✅ 找到现有静态 IP: {ip}")
            return ip, formatted_hostname

    # 创建新的静态 IP
    print("未找到现有静态 IP，正在创建新的...")
    create_result = subprocess.run(
        [
            "gcloud", "compute", "addresses", "create",
            formatted_hostname,
            "--region", region,
            "--network-tier", "STANDARD"
        ],
        capture_output=True,
        text=True
    )
    
    if create_result.returncode != 0:
        print(f"❌ 创建静态 IP 失败: {create_result.stderr}")
        return None, None

    # 获取新创建的 IP
    new_address_result = subprocess.run(
        [
            "gcloud", "compute", "addresses", "describe",
            formatted_hostname,
            "--region", region,
            "--format=json"
        ],
        capture_output=True,
        text=True
    )
    
    if new_address_result.returncode != 0:
        print(f"❌ 获取静态 IP 信息失败: {new_address_result.stderr}")
        return None, None

    new_address = json.loads(new_address_result.stdout)
    ip = new_address["address"]
    print(f"✅ 新静态 IP 已创建: {ip}")
    return ip, formatted_hostname

def generate_terraform_config(project_id, static_ip, credentials_path):
    """生成 Terraform 配置文件"""
    print_step("生成 Terraform 配置")
    formatted_hostname = format_hostname(n8n_hostname)

    config = f"""# Terraform 配置文件 - GCP 上的 n8n 部署
# 由 setup.py 自动生成

terraform {{
  required_version = ">= 1.0"
  required_providers {{
    google = {{
      source  = "hashicorp/google"
      version = "~> 5.0"
    }}
  }}
}}

provider "google" {{
  project     = "{project_id}"
  region      = "{region}"
  credentials = file("{credentials_path}")
}}

# GCP 计算实例
resource "google_compute_instance" "{formatted_hostname}" {{
  name         = "{formatted_hostname}"
  machine_type = "e2-micro"  # 免费层
  zone         = "{zone}"

  # 启动磁盘配置
  boot_disk {{
    initialize_params {{
      image = "ubuntu-os-cloud/ubuntu-2204-lts"
      size  = 30  # GB
      type  = "pd-standard"
    }}
  }}

  # 网络接口
  network_interface {{
    network = "default"
    access_config {{
      nat_ip       = "{static_ip}"
      network_tier = "STANDARD"
    }}
  }}

  # SSH 密钥
  metadata = {{
    ssh-keys = "{ssh_key}"
  }}

  # 标签
  tags = ["n8n", "automation"]

  # SSH 连接配置
  connection {{
    type        = "ssh"
    user        = "{ssh_user}"
    private_key = file("{ssh_private_key_path}")
    host        = self.network_interface[0].access_config[0].nat_ip
    timeout     = "5m"
  }}

  # 上传文件到服务器
  provisioner "file" {{
    source      = "scripts/setup_server.sh"
    destination = "/tmp/setup_server.sh"
  }}

  provisioner "file" {{
    source      = "scripts/setup_cloudflare.sh"
    destination = "/tmp/setup_cloudflare.sh"
  }}

  provisioner "file" {{
    source      = "config/docker-compose.yml"
    destination = "/tmp/docker-compose.yml"
  }}

  provisioner "file" {{
    source      = "config/docker-compose.service"
    destination = "/tmp/docker-compose.service"
  }}

  provisioner "file" {{
    source      = "scripts/updater.sh"
    destination = "/tmp/updater.sh"
  }}

  provisioner "file" {{
    source      = "config/Dockerfile"
    destination = "/tmp/Dockerfile"
  }}

  provisioner "file" {{
    source      = "config/docker-entrypoint.sh"
    destination = "/tmp/docker-entrypoint.sh"
  }}

  # 移动文件到最终位置并设置权限
  provisioner "remote-exec" {{
    inline = [
      "sudo mkdir -p /opt",
      "sudo mv /tmp/setup_server.sh /opt/setup_server.sh",
      "sudo chmod +x /opt/setup_server.sh",
      "sudo mv /tmp/setup_cloudflare.sh /opt/setup_cloudflare.sh",
      "sudo chmod +x /opt/setup_cloudflare.sh",
      "sudo mv /tmp/docker-compose.yml /opt/docker-compose.yml",
      "sudo mv /tmp/docker-compose.service /etc/systemd/system/docker-compose.service",
      "sudo mv /tmp/updater.sh /opt/updater.sh",
      "sudo chmod +x /opt/updater.sh",
      "sudo mv /tmp/Dockerfile /opt/Dockerfile",
      "sudo mv /tmp/docker-entrypoint.sh /opt/docker-entrypoint.sh",
      "sudo chmod +x /opt/docker-entrypoint.sh",
    ]
  }}
}}

# 输出信息
output "instance_name" {{
  value       = google_compute_instance.{formatted_hostname}.name
  description = "实例名称"
}}

output "instance_ip" {{
  value       = "{static_ip}"
  description = "实例公网 IP"
}}

output "ssh_command" {{
  value       = "ssh -i {ssh_private_key_path} {ssh_user}@{static_ip}"
  description = "SSH 连接命令"
}}

output "n8n_url" {{
  value       = "https://{n8n_hostname}"
  description = "n8n 访问地址（需完成 Cloudflare 配置后）"
}}
"""

    with open("setup.tf", "w") as file:
        file.write(config)
    
    print(f"✅ Terraform 配置已生成: setup.tf")

def create_file(file_name, content):
    """创建文件"""
    with open(file_name, "w") as file:
        file.write(content)
    print(f"✅ 已创建: {file_name}")

def parse_arguments():
    """解析命令行参数"""
    parser = argparse.ArgumentParser(
        description="n8n GCP 自动化部署脚本",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例用法:
  python setup.py                    # 完整部署
  python setup.py --no-upload        # 仅生成配置文件，不上传到 GCP
  python setup.py --check            # 检查配置和前置条件
        """
    )
    parser.add_argument(
        "--no-upload",
        action="store_true",
        help="仅生成配置文件，不上传到 GCP"
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="检查配置和前置条件"
    )
    return parser.parse_args()

# ========== 脚本内容定义 ==========

# 这些脚本将在后续步骤中创建到相应的文件中
# 保持与原项目兼容，同时添加中文注释

def main():
    """主函数"""
    print("""
╔═══════════════════════════════════════════════════════════╗
║         n8n GCP 自动化部署脚本                            ║
║         基于 danielraffel/n8n-gcp                         ║
╚═══════════════════════════════════════════════════════════╝
    """)
    
    # 切换到脚本所在目录
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    args = parse_arguments()
    
    # 检查前置条件
    if args.check:
        check_prerequisites()
        print("\n✅ 配置检查完成")
        sys.exit(0)
    
    # 验证必填配置
    if "YOURDOMAIN.COM" in n8n_hostname:
        print("❌ 错误: 请先在脚本中配置 n8n_hostname")
        print("   打开 setup.py，修改 n8n_hostname 变量")
        sys.exit(1)
    
    if "YOUR_SSH_KEY_STRING" in ssh_key:
        print("❌ 错误: 请先在脚本中配置 ssh_key")
        print("   打开 setup.py，修改 ssh_key 变量")
        sys.exit(1)
    
    if "YOUR_USERNAME" in ssh_private_key_path:
        print("❌ 错误: 请先在脚本中配置 ssh_private_key_path")
        print("   打开 setup.py，修改 ssh_private_key_path 变量")
        sys.exit(1)
    
    check_prerequisites()
    
    if args.no_upload:
        # 仅生成本地配置文件
        print_step("仅生成本地配置文件模式")
        print("注意: 此模式下不会执行任何 GCP 操作")
        print("\n生成完成后，你可以:")
        print("1. 检查生成的文件")
        print("2. 如需部署，重新运行: python setup.py")
        print("\n按 Ctrl+C 取消，或按 Enter 继续...")
        input()
        
        # 这里需要调用创建配置文件的函数
        # 将在后续步骤中实现
        print("\n✅ 配置文件生成完成")
    else:
        # 完整部署流程
        print_step("开始完整部署流程")
        
        # 1. 获取项目 ID
        project_id = fetch_project_id()
        if not project_id:
            print("❌ 无法获取项目 ID")
            sys.exit(1)
        
        # 2. 获取服务账号密钥
        credentials_path = fetch_service_account_key()
        if not credentials_path:
            print("❌ 无法获取服务账号密钥")
            sys.exit(1)
        
        # 3. 检查或创建静态 IP
        static_ip, formatted_hostname = check_static_ip(n8n_hostname, region)
        if not static_ip or not formatted_hostname:
            print("❌ 无法获取静态 IP")
            sys.exit(1)
        
        # 4. 生成 Terraform 配置
        generate_terraform_config(project_id, static_ip, credentials_path)
        
        # 5. 生成其他配置文件
        # 将在后续步骤中实现
        
        print_step("配置生成完成")
        print(f"""
下一步操作:

1. 初始化 Terraform:
   terraform init

2. 查看部署计划:
   terraform plan

3. 执行部署:
   terraform apply

4. 部署完成后，SSH 到服务器:
   ssh -i {ssh_private_key_path} {ssh_user}@{static_ip}

5. 运行安装脚本:
   sudo sh /opt/setup_server.sh
   sudo sh /opt/setup_cloudflare.sh

6. 访问 n8n:
   https://{n8n_hostname}
        """)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n用户取消操作")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ 发生错误: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
