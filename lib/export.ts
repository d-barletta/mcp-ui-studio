import { MCPUIComponent, ExportLanguage } from './types';

export function generateTypeScriptExport(component: MCPUIComponent): string {
  return `// MCP-UI Handler - TypeScript
import { MCPUIHandler } from '@modelcontextprotocol/sdk';

export const handler: MCPUIHandler = {
  render: () => ${JSON.stringify(component, null, 2)}
};

// Usage example:
// server.addHandler('ui', handler);
`;
}

export function generatePythonExport(component: MCPUIComponent): string {
  const jsonStr = JSON.stringify(component, null, 2);
  return `# MCP-UI Handler - Python
from mcp.server import MCPServer
from mcp.types import UIComponent

def render() -> UIComponent:
    """Render the MCP-UI component."""
    return ${jsonStr.replace(/"/g, '"').replace(/true/g, 'True').replace(/false/g, 'False').replace(/null/g, 'None')}

# Usage example:
# server.add_ui_handler("ui", render)
`;
}

export function generateRubyExport(component: MCPUIComponent): string {
  const jsonStr = JSON.stringify(component, null, 2);
  return `# MCP-UI Handler - Ruby
require 'mcp/server'

class UIHandler
  def self.render
    ${jsonStr}
  end
end

# Usage example:
# server.add_ui_handler('ui', UIHandler.method(:render))
`;
}

export function generateExport(component: MCPUIComponent, language: ExportLanguage): string {
  switch (language) {
    case 'typescript':
      return generateTypeScriptExport(component);
    case 'python':
      return generatePythonExport(component);
    case 'ruby':
      return generateRubyExport(component);
    default:
      return generateTypeScriptExport(component);
  }
}

// Framework bridge: Convert Shadcn-like structure to MCP-UI
export function convertShadcnToMCPUI(_shadcnCode: string): MCPUIComponent {
  // This is a simplified converter - in production, this would parse JSX/TSX
  // For now, we'll return a basic structure
  return {
    type: 'container',
    props: {
      className: 'converted-from-shadcn'
    },
    children: [
      {
        type: 'text',
        props: {
          content: 'Converted component'
        }
      }
    ]
  };
}
