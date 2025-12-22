import { ContentType, Encoding, UIResource, ExportLanguage, AdapterConfig } from './types';

// Options interface matching MCP-UI official API
export interface CreateUIResourceOptions {
  uri: string;
  content: ContentType;
  encoding?: Encoding;
  adapter?: AdapterConfig;
}

export function createUIResource(options: CreateUIResourceOptions): UIResource {
  const { uri, content, encoding = 'text' } = options;

  let mimeType: UIResource['resource']['mimeType'];
  let resourceContent: string;

  if (content.type === 'rawHtml') {
    mimeType = 'text/html';
    resourceContent = content.htmlString;
  } else if (content.type === 'externalUrl') {
    mimeType = 'text/uri-list';
    resourceContent = content.iframeUrl;
  } else {
    mimeType =
      `application/vnd.mcp-ui.remote-dom+javascript; framework=${content.framework}` as UIResource['resource']['mimeType'];
    resourceContent = content.script;
  }

  const resource: UIResource = {
    type: 'resource',
    resource: {
      uri,
      mimeType,
    },
  };

  if (encoding === 'text') {
    resource.resource.text = resourceContent;
  } else {
    resource.resource.blob = Buffer.from(resourceContent).toString('base64');
  }

  return resource;
}

export function generateTypeScriptExport(
  content: ContentType,
  encoding: Encoding = 'text',
  adapter?: AdapterConfig
): string {
  let contentStr: string;

  if (content.type === 'rawHtml') {
    // Use template literal for HTML
    contentStr = `{
    type: 'rawHtml',
    htmlString: \`${content.htmlString}\`
  }`;
  } else if (content.type === 'externalUrl') {
    contentStr = `{
    type: 'externalUrl',
    iframeUrl: '${content.iframeUrl}'
  }`;
  } else {
    // remoteDom - use template literal for script
    contentStr = `{
    type: 'remoteDom',
    script: \`${content.script}\`,
    framework: '${content.framework}'
  }`;
  }

  // Build adapter configuration
  let adapterStr = '';
  if (adapter && adapter.type !== 'none') {
    if (adapter.type === 'chatgpt' && adapter.chatgpt?.enabled) {
      const config = adapter.chatgpt;
      adapterStr = `,
  adapters: {
    appsSdk: {
      enabled: true,
      config: {
        intentHandling: '${config.intentHandling || 'prompt'}'
      }
    }
  },
  metadata: {
    'openai/widgetDescription': '${config.widgetDescription || 'Interactive widget'}',
    'openai/widgetPrefersBorder': ${config.widgetPrefersBorder !== false}${
      config.widgetCSP
        ? `,
    'openai/widgetCSP': ${JSON.stringify(config.widgetCSP, null, 4).replace(/\n/g, '\n    ')}`
        : ''
    }
  }`;
    } else if (adapter.type === 'mcp-apps' && adapter.mcpApps?.enabled) {
      adapterStr = `,
  adapters: {
    mcpApps: {
      enabled: true
    }
  }`;
    }
  }

  const baseCode = `// MCP-UI Handler - TypeScript
import { createUIResource } from '@mcp-ui/server';

const resource = createUIResource({
  uri: 'ui://my-component/instance-1',
  content: ${contentStr},
  encoding: '${encoding}'${adapterStr}
});

// Return in MCP response
export function handler() {
  return { content: [resource] };
}`;

  // Add adapter-specific usage examples
  if (adapter?.type === 'chatgpt' && adapter.chatgpt?.enabled) {
    return `${baseCode}

// ChatGPT Apps SDK Usage:
// 1. Register the template resource via MCP Resources API
// server.registerResource('ui://my-component/instance-1', async () => resource.resource);
//
// 2. Reference the template in your tool descriptor
// server.registerTool('my-tool', {
//   title: 'My Interactive Tool',
//   description: 'Tool with interactive UI',
//   inputSchema: { type: 'object', properties: {} },
//   _meta: { 'openai/outputTemplate': 'ui://my-component/instance-1' }
// });
//
// 3. Tool execution returns embedded resource for MCP-native hosts
// server.setRequestHandler(CallToolRequestSchema, async (request) => handler());
`;
  } else if (adapter?.type === 'mcp-apps' && adapter.mcpApps?.enabled) {
    return `${baseCode}

// MCP Apps SEP Usage:
// The adapter automatically translates MCP-UI protocol to MCP Apps SEP protocol.
// Your widget communicates via postMessage, and the adapter handles protocol translation.
//
// Example tool handler:
// server.setRequestHandler(CallToolRequestSchema, async (request) => handler());
//
// Host integration:
// import { UIResourceRenderer } from '@mcp-ui/client';
// <UIResourceRenderer 
//   resource={resource.resource} 
//   onUIAction={(action) => console.log('Action:', action)}
// />
`;
  }

  return `${baseCode}

// Usage example:
// server.setRequestHandler(ListToolsRequestSchema, async () => ({
//   tools: [{ name: 'ui-component', description: 'Interactive UI', inputSchema: { type: 'object', properties: {} } }]
// }));
// server.setRequestHandler(CallToolRequestSchema, async (request) => handler());
`;
}

export function generatePythonExport(
  content: ContentType,
  encoding: Encoding = 'text',
  adapter?: AdapterConfig
): string {
  let contentDict: string;
  if (content.type === 'rawHtml') {
    contentDict = `{ "type": "rawHtml", "htmlString": """${content.htmlString}""" }`;
  } else if (content.type === 'externalUrl') {
    contentDict = `{ "type": "externalUrl", "iframeUrl": "${content.iframeUrl}" }`;
  } else {
    contentDict = `{ "type": "remoteDom", "script": """${content.script}""", "framework": "${content.framework}" }`;
  }

  // Build adapter configuration
  let adapterDict = '';
  if (adapter && adapter.type !== 'none') {
    if (adapter.type === 'chatgpt' && adapter.chatgpt?.enabled) {
      const config = adapter.chatgpt;
      adapterDict = `,
        adapters={
            "appsSdk": {
                "enabled": True,
                "config": {
                    "intentHandling": "${config.intentHandling || 'prompt'}"
                }
            }
        },
        metadata={
            "openai/widgetDescription": "${config.widgetDescription || 'Interactive widget'}",
            "openai/widgetPrefersBorder": ${config.widgetPrefersBorder !== false ? 'True' : 'False'}${
              config.widgetCSP
                ? `,
            "openai/widgetCSP": ${JSON.stringify(config.widgetCSP, null, 12).replace(/\n/g, '\n            ')}`
                : ''
            }
        }`;
    } else if (adapter.type === 'mcp-apps' && adapter.mcpApps?.enabled) {
      adapterDict = `,
        adapters={
            "mcpApps": {
                "enabled": True
            }
        }`;
    }
  }

  const baseCode = `# MCP-UI Handler - Python
from mcp_ui_server import create_ui_resource

def handler():
    """Create and return MCP-UI resource."""
    resource = create_ui_resource(
        uri='ui://my-component/instance-1',
        content=${contentDict},
        encoding='${encoding}'${adapterDict}
    )
    return { "content": [resource] }`;

  // Add adapter-specific usage examples
  if (adapter?.type === 'chatgpt' && adapter.chatgpt?.enabled) {
    return `${baseCode}

# ChatGPT Apps SDK Usage:
# 1. Register the template resource via MCP Resources API
# @server.resource("ui://my-component/instance-1")
# async def get_resource():
#     return resource["resource"]
#
# 2. Reference the template in your tool descriptor
# @server.tool("my-tool", 
#     title="My Interactive Tool",
#     description="Tool with interactive UI",
#     _meta={"openai/outputTemplate": "ui://my-component/instance-1"})
# async def my_tool():
#     pass
#
# 3. Tool execution returns embedded resource for MCP-native hosts
# @server.call_tool()
# async def call_tool(name: str, arguments: dict):
#     return handler()["content"]
`;
  } else if (adapter?.type === 'mcp-apps' && adapter.mcpApps?.enabled) {
    return `${baseCode}

# MCP Apps SEP Usage:
# The adapter automatically translates MCP-UI protocol to MCP Apps SEP protocol.
# Your widget communicates via postMessage, and the adapter handles protocol translation.
#
# Example tool handler:
# @server.call_tool()
# async def call_tool(name: str, arguments: dict):
#     return handler()["content"]
`;
  }

  return `${baseCode}

# Usage example:
# @server.call_tool()
# async def call_tool(name: str, arguments: dict) -> list[TextContent | ImageContent | EmbeddedResource]:
#     return handler()["content"]
`;
}

export function generateRubyExport(
  content: ContentType,
  encoding: Encoding = 'text',
  adapter?: AdapterConfig
): string {
  let contentHash: string;
  if (content.type === 'rawHtml') {
    contentHash = `{ type: :raw_html, htmlString: '${content.htmlString.replace(/'/g, "\\'")}'  }`;
  } else if (content.type === 'externalUrl') {
    contentHash = `{ type: :external_url, iframeUrl: '${content.iframeUrl}' }`;
  } else {
    contentHash = `{ type: :remote_dom, script: <<~SCRIPT\n${content.script}\nSCRIPT\n, framework: :${content.framework} }`;
  }

  // Build adapter configuration
  let adapterHash = '';
  if (adapter && adapter.type !== 'none') {
    if (adapter.type === 'chatgpt' && adapter.chatgpt?.enabled) {
      const config = adapter.chatgpt;
      const cspHash = config.widgetCSP
        ? `{
      connect_domains: [${(config.widgetCSP.connect_domains || []).map((d) => `'${d}'`).join(', ')}],
      resource_domains: [${(config.widgetCSP.resource_domains || []).map((d) => `'${d}'`).join(', ')}]
    }`
        : '';
      adapterHash = `,
    adapters: {
      appsSdk: {
        enabled: true,
        config: {
          intentHandling: :${config.intentHandling || 'prompt'}
        }
      }
    },
    metadata: {
      'openai/widgetDescription': '${config.widgetDescription || 'Interactive widget'}',
      'openai/widgetPrefersBorder': ${config.widgetPrefersBorder !== false}${cspHash ? `,\n      'openai/widgetCSP': ${cspHash}` : ''}
    }`;
    } else if (adapter.type === 'mcp-apps' && adapter.mcpApps?.enabled) {
      adapterHash = `,
    adapters: {
      mcpApps: {
        enabled: true
      }
    }`;
    }
  }

  const baseCode = `# MCP-UI Handler - Ruby
require 'mcp_ui_server'

def handler
  resource = McpUiServer.create_ui_resource(
    uri: 'ui://my-component/instance-1',
    content: ${contentHash},
    encoding: :${encoding}${adapterHash}
  )
  
  { content: [resource] }
end`;

  // Add adapter-specific usage examples
  if (adapter?.type === 'chatgpt' && adapter.chatgpt?.enabled) {
    return `${baseCode}

# ChatGPT Apps SDK Usage:
# 1. Register the template resource via MCP Resources API
# server.resource('ui://my-component/instance-1') do
#   resource[:resource]
# end
#
# 2. Reference the template in your tool descriptor
# server.tool('my-tool', 
#   title: 'My Interactive Tool',
#   description: 'Tool with interactive UI',
#   _meta: { 'openai/outputTemplate': 'ui://my-component/instance-1' }
# )
#
# 3. Tool execution returns embedded resource for MCP-native hosts
# server.tool('ui-component', 'Interactive UI') do
#   handler[:content]
# end
`;
  } else if (adapter?.type === 'mcp-apps' && adapter.mcpApps?.enabled) {
    return `${baseCode}

# MCP Apps SEP Usage:
# The adapter automatically translates MCP-UI protocol to MCP Apps SEP protocol.
# Your widget communicates via postMessage, and the adapter handles protocol translation.
#
# Example tool handler:
# server.tool('ui-component', 'Interactive UI') do
#   handler[:content]
# end
`;
  }

  return `${baseCode}

# Usage example:
# server.tool('ui-component', 'Interactive UI') do
#   handler[:content]
# end
`;
}

export function generateExport(
  content: ContentType,
  language: ExportLanguage,
  encoding: Encoding = 'text',
  adapter?: AdapterConfig
): string {
  switch (language) {
    case 'typescript':
      return generateTypeScriptExport(content, encoding, adapter);
    case 'python':
      return generatePythonExport(content, encoding, adapter);
    case 'ruby':
      return generateRubyExport(content, encoding, adapter);
    default:
      return generateTypeScriptExport(content, encoding, adapter);
  }
}

// Framework bridge: Convert Shadcn/HTML to MCP-UI
export function convertShadcnToMCPUI(_shadcnCode: string): ContentType {
  // This is a simplified converter - in production, this would parse JSX/TSX
  // For now, we'll return a basic HTML structure
  return {
    type: 'rawHtml',
    htmlString: '<div class="converted-from-shadcn"><p>Converted component</p></div>',
  };
}
