import * as vscode from 'vscode';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from 'zod';
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

/**
 * Closes editor tabs in VS Code
 * @param mode Which tabs to close: 'all', 'others', or 'group'
 * @returns Promise that resolves when the operation completes
 */
export async function closeTabs(mode: 'all' | 'others' | 'group'): Promise<void> {
    console.log(`[closeTabs] Starting with mode: ${mode}`);
    
    const commands = {
        all: 'workbench.action.closeAllEditors',
        others: 'workbench.action.closeOtherEditors',
        group: 'workbench.action.closeEditorsInGroup'
    };
    
    const command = commands[mode];
    console.log(`[closeTabs] Executing command: ${command}`);
    
    try {
        await vscode.commands.executeCommand(command);
        console.log(`[closeTabs] Successfully closed ${mode} tabs`);
    } catch (error) {
        console.error(`[closeTabs] Error closing tabs: ${error}`);
        throw new Error(`Failed to close tabs: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Register tab management tools with the MCP server
 * @param server The MCP server instance
 */
export function registerTabTools(server: McpServer): void {
    // Define the close_tabs_code tool
    server.tool(
        "close_tabs_code",
        "Close editor tabs in VS Code to optimize context usage. Useful when token usage is high due to many open tabs.",
        {
            mode: z.enum(['all', 'others', 'group']).describe(
                "Which tabs to close:\n" +
                "- 'all': Close all editor tabs\n" +
                "- 'others': Close all tabs except the currently active one\n" +
                "- 'group': Close all tabs in the current editor group"
            )
        },
        async ({ mode }): Promise<CallToolResult> => {
            try {
                await closeTabs(mode);
                
                const messages: Record<typeof mode, string> = {
                    all: 'All editor tabs have been closed',
                    others: 'All other tabs (except current) have been closed',
                    group: 'All tabs in the current group have been closed'
                };
                
                return {
                    content: [{
                        type: "text",
                        text: messages[mode]
                    }],
                    isError: false
                };
            } catch (error) {
                return {
                    content: [{
                        type: "text",
                        text: `Error closing tabs: ${error instanceof Error ? error.message : String(error)}`
                    }],
                    isError: true
                };
            }
        }
    );
    
    console.log('[registerTabTools] Tab management tools registered successfully');
}
