import * as vscode from 'vscode';
import { N8nClient, N8nWorkflow, N8nExecution } from './n8n-client';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// 全局变量
let n8nClient: N8nClient | null = null;
let outputChannel: vscode.OutputChannel;

export function activate(context: vscode.ExtensionContext) {
  // 创建输出通道用于日志
  outputChannel = vscode.window.createOutputChannel('n8n Connector');
  outputChannel.appendLine('n8n VSCode Connector activated');

  // 注册命令
  const connectCommand = vscode.commands.registerCommand('n8n-vscode-connector.connect', connectToN8n);
  const listWorkflowsCommand = vscode.commands.registerCommand('n8n-vscode-connector.listWorkflows', listWorkflows);
  const executeWorkflowCommand = vscode.commands.registerCommand('n8n-vscode-connector.executeWorkflow', executeWorkflow);
  const viewWorkflowCommand = vscode.commands.registerCommand('n8n-vscode-connector.viewWorkflow', viewWorkflowDetails);

  context.subscriptions.push(connectCommand, listWorkflowsCommand, executeWorkflowCommand, viewWorkflowCommand);

  // 检查配置并尝试自动连接
  checkConfigurationAndConnect();
}

export function deactivate() {
  if (outputChannel) {
    outputChannel.dispose();
  }
}

// 连接到n8n实例
async function connectToN8n(): Promise<void> {
  try {
    const config = vscode.workspace.getConfiguration('n8n-vscode-connector');
    let baseUrl = config.get<string>('baseUrl') || '';
    let apiKey = config.get<string>('apiKey') || '';

    // 如果配置为空，提示用户输入
    if (!baseUrl) {
      const inputUrl = await vscode.window.showInputBox({
        prompt: 'Enter n8n instance URL',
        placeHolder: 'https://your-space.hf.space',
        validateInput: (value) => {
          if (!value) {
            return 'URL is required';
          }
          try {
            new URL(value);
            return null;
          } catch {
            return 'Please enter a valid URL';
          }
        }
      });

      if (!inputUrl) {
        return;
      }

      baseUrl = inputUrl;
      // 保存配置
      await config.update('baseUrl', baseUrl, vscode.ConfigurationTarget.Global);
    }

    if (!apiKey) {
      const useApiKey = await vscode.window.showQuickPick(['Yes', 'No'], {
        placeHolder: 'Does your n8n instance require an API key?'
      });

      if (useApiKey === 'Yes') {
        const inputApiKey = await vscode.window.showInputBox({
          prompt: 'Enter n8n API Key',
          password: true,
          validateInput: (value) => {
            if (!value) {
              return 'API key is required';
            }
            return null;
          }
        });

        if (!inputApiKey) {
          return;
        }

        apiKey = inputApiKey;
        // 保存配置
        await config.update('apiKey', apiKey, vscode.ConfigurationTarget.Global);
      }
    }

    // 创建客户端并测试连接
    n8nClient = new N8nClient(baseUrl, apiKey);

    const isConnected = await n8nClient.testConnection();
    if (isConnected) {
      outputChannel.appendLine(`✅ Successfully connected to n8n instance: ${baseUrl}`);
      vscode.window.showInformationMessage('Successfully connected to n8n instance!');
    } else {
      outputChannel.appendLine(`❌ Failed to connect to n8n instance: ${baseUrl}`);
      vscode.window.showErrorMessage('Failed to connect to n8n instance. Please check your configuration.');
      n8nClient = null;
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    outputChannel.appendLine(`❌ Connection error: ${errorMessage}`);
    vscode.window.showErrorMessage(`Connection failed: ${errorMessage}`);
  }
}

// 列出工作流
async function listWorkflows(): Promise<void> {
  if (!n8nClient) {
    vscode.window.showErrorMessage('Please connect to n8n instance first.');
    return;
  }

  try {
    outputChannel.appendLine('📋 Fetching workflows...');
    const workflows = await n8nClient.getWorkflows();

    if (workflows.length === 0) {
      vscode.window.showInformationMessage('No workflows found.');
      return;
    }

    // 显示工作流选择器
    const workflowItems = workflows.map(workflow => ({
      label: workflow.name,
      description: workflow.active ? 'Active' : 'Inactive',
      detail: `ID: ${workflow.id}`,
      workflow: workflow
    }));

    const selectedWorkflow = await vscode.window.showQuickPick(workflowItems, {
      placeHolder: 'Select a workflow'
    });

    if (selectedWorkflow) {
      await showWorkflowDetails(selectedWorkflow.workflow);
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    outputChannel.appendLine(`❌ Failed to list workflows: ${errorMessage}`);
    vscode.window.showErrorMessage(`Failed to list workflows: ${errorMessage}`);
  }
}

// 执行工作流
async function executeWorkflow(): Promise<void> {
  if (!n8nClient) {
    vscode.window.showErrorMessage('Please connect to n8n instance first.');
    return;
  }

  try {
    const workflows = await n8nClient.getWorkflows();

    if (workflows.length === 0) {
      vscode.window.showInformationMessage('No workflows found.');
      return;
    }

    const workflowItems = workflows
      .filter(workflow => workflow.active)
      .map(workflow => ({
        label: workflow.name,
        description: `ID: ${workflow.id}`,
        workflow: workflow
      }));

    if (workflowItems.length === 0) {
      vscode.window.showInformationMessage('No active workflows found.');
      return;
    }

    const selectedWorkflow = await vscode.window.showQuickPick(workflowItems, {
      placeHolder: 'Select a workflow to execute'
    });

    if (!selectedWorkflow) {
      return;
    }

    // 询问是否提供输入数据
    const provideData = await vscode.window.showQuickPick(['No', 'Yes'], {
      placeHolder: 'Provide input data for the workflow?'
    });

    let inputData: any = undefined;
    if (provideData === 'Yes') {
      const dataInput = await vscode.window.showInputBox({
        prompt: 'Enter JSON input data',
        placeHolder: '{"key": "value"}',
        validateInput: (value) => {
          if (!value) {
            return null;
          }
          try {
            JSON.parse(value);
            return null;
          } catch {
            return 'Please enter valid JSON';
          }
        }
      });

      if (dataInput) {
        inputData = JSON.parse(dataInput);
      }
    }

    // 执行工作流
    outputChannel.appendLine(`🚀 Executing workflow: ${selectedWorkflow.workflow.name}`);
    const execution = await n8nClient.executeWorkflow(selectedWorkflow.workflow.id, inputData);

    outputChannel.appendLine(`✅ Workflow execution started: ${execution.id}`);
    vscode.window.showInformationMessage(`Workflow execution started! ID: ${execution.id}`);

    // 显示执行详情
    await showExecutionDetails(execution);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    outputChannel.appendLine(`❌ Failed to execute workflow: ${errorMessage}`);
    vscode.window.showErrorMessage(`Failed to execute workflow: ${errorMessage}`);
  }
}

// 查看工作流详情
async function viewWorkflowDetails(): Promise<void> {
  if (!n8nClient) {
    vscode.window.showErrorMessage('Please connect to n8n instance first.');
    return;
  }

  try {
    const workflowId = await vscode.window.showInputBox({
      prompt: 'Enter workflow ID',
      placeHolder: 'workflow-id',
      validateInput: (value) => {
        if (!value) {
          return 'Workflow ID is required';
        }
        return null;
      }
    });

    if (!workflowId) {
      return;
    }

    const workflow = await n8nClient.getWorkflow(workflowId);
    await showWorkflowDetails(workflow);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    outputChannel.appendLine(`❌ Failed to view workflow: ${errorMessage}`);
    vscode.window.showErrorMessage(`Failed to view workflow: ${errorMessage}`);
  }
}

// 显示工作流详情
async function showWorkflowDetails(workflow: N8nWorkflow): Promise<void> {
  const panel = vscode.window.createWebviewPanel(
    'n8nWorkflowDetails',
    `Workflow: ${workflow.name}`,
    vscode.ViewColumn.One,
    {}
  );

  panel.webview.html = getWorkflowDetailsHtml(workflow);
}

// 显示执行详情
async function showExecutionDetails(execution: N8nExecution): Promise<void> {
  const panel = vscode.window.createWebviewPanel(
    'n8nExecutionDetails',
    `Execution: ${execution.id}`,
    vscode.ViewColumn.One,
    {}
  );

  panel.webview.html = getExecutionDetailsHtml(execution);
}

// 检查配置并尝试连接
async function checkConfigurationAndConnect(): Promise<void> {
  // 优先使用环境变量
  let baseUrl = process.env.N8N_BASE_URL;
  let apiKey = process.env.N8N_API_KEY;

  // 如果环境变量不存在，回退到VSCode配置
  if (!baseUrl) {
    const config = vscode.workspace.getConfiguration('n8n-vscode-connector');
    baseUrl = config.get<string>('baseUrl') || '';
    apiKey = config.get<string>('apiKey') || '';
  }

  if (baseUrl) {
    n8nClient = new N8nClient(baseUrl, apiKey);
    const isConnected = await n8nClient.testConnection();
    if (isConnected) {
      outputChannel.appendLine(`✅ Auto-connected to n8n instance: ${baseUrl}`);
      outputChannel.appendLine(`📝 Using configuration from: ${process.env.N8N_BASE_URL ? 'Environment variables' : 'VSCode settings'}`);
    } else {
      outputChannel.appendLine(`⚠️  Auto-connection failed for: ${baseUrl}`);
    }
  } else {
    outputChannel.appendLine('ℹ️  No n8n configuration found. Use "n8n: Connect to Instance" command to set up.');
  }
}

// 生成工作流详情HTML
function getWorkflowDetailsHtml(workflow: N8nWorkflow): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Workflow Details</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .header { background: #f0f0f0; padding: 10px; margin-bottom: 20px; }
        .status { padding: 5px 10px; border-radius: 3px; color: white; }
        .status.active { background: green; }
        .status.inactive { background: gray; }
        .details { margin-top: 20px; }
        .json { background: #f5f5f5; padding: 10px; border-radius: 3px; font-family: monospace; white-space: pre-wrap; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${workflow.name}</h1>
        <span class="status ${workflow.active ? 'active' : 'inactive'}">
          ${workflow.active ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div class="details">
        <h3>Basic Information</h3>
        <p><strong>ID:</strong> ${workflow.id}</p>
        <p><strong>Created:</strong> ${new Date(workflow.createdAt).toLocaleString()}</p>
        <p><strong>Updated:</strong> ${new Date(workflow.updatedAt).toLocaleString()}</p>
        <p><strong>Nodes:</strong> ${workflow.nodes.length}</p>

        <h3>Workflow Data</h3>
        <div class="json">${JSON.stringify(workflow, null, 2)}</div>
      </div>
    </body>
    </html>
  `;
}

// 生成执行详情HTML
function getExecutionDetailsHtml(execution: N8nExecution): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Execution Details</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .header { background: #f0f0f0; padding: 10px; margin-bottom: 20px; }
        .status { padding: 5px 10px; border-radius: 3px; color: white; }
        .status.success { background: green; }
        .status.error { background: red; }
        .status.running { background: orange; }
        .status.waiting { background: blue; }
        .details { margin-top: 20px; }
        .json { background: #f5f5f5; padding: 10px; border-radius: 3px; font-family: monospace; white-space: pre-wrap; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Execution ${execution.id}</h1>
        <span class="status ${execution.status}">
          ${execution.status.toUpperCase()}
        </span>
      </div>

      <div class="details">
        <h3>Execution Information</h3>
        <p><strong>Workflow ID:</strong> ${execution.workflowId}</p>
        <p><strong>Mode:</strong> ${execution.mode}</p>
        <p><strong>Started:</strong> ${new Date(execution.startedAt).toLocaleString()}</p>
        ${execution.stoppedAt ? `<p><strong>Stopped:</strong> ${new Date(execution.stoppedAt).toLocaleString()}</p>` : ''}

        <h3>Execution Data</h3>
        <div class="json">${JSON.stringify(execution.data, null, 2)}</div>
      </div>
    </body>
    </html>
  `;
}
