import { ContentType, Encoding, UIResource, ExportLanguage } from './types';

// Options interface matching MCP-UI official API
export interface CreateUIResourceOptions {
  uri: string;
  content: ContentType;
  encoding?: Encoding;
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
  encoding: Encoding = 'text'
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

  return `// MCP-UI Handler - TypeScript
import { createUIResource } from '@mcp-ui/server';

const resource = createUIResource({
  uri: 'ui://my-component/instance-1',
  content: ${contentStr},
  encoding: '${encoding}',
});

// Return in MCP response
export function handler() {
  return { content: [resource] };
}

// Usage example:
// server.setRequestHandler(ListToolsRequestSchema, async () => ({
//   tools: [{ name: 'ui-component', description: 'Interactive UI', inputSchema: { type: 'object', properties: {} } }]
// }));
// server.setRequestHandler(CallToolRequestSchema, async (request) => handler());
`;
}

export function generatePythonExport(content: ContentType, encoding: Encoding = 'text'): string {
  let contentDict: string;
  if (content.type === 'rawHtml') {
    contentDict = `{ "type": "rawHtml", "htmlString": """${content.htmlString}""" }`;
  } else if (content.type === 'externalUrl') {
    contentDict = `{ "type": "externalUrl", "iframeUrl": "${content.iframeUrl}" }`;
  } else {
    contentDict = `{ "type": "remoteDom", "script": """${content.script}""", "framework": "${content.framework}" }`;
  }

  return `# MCP-UI Handler - Python
from mcp_ui_server import create_ui_resource

def handler():
    """Create and return MCP-UI resource."""
    resource = create_ui_resource(
        uri='ui://my-component/instance-1',
        content=${contentDict},
        encoding='${encoding}'
    )
    return { "content": [resource] }

# Usage example:
# @server.call_tool()
# async def call_tool(name: str, arguments: dict) -> list[TextContent | ImageContent | EmbeddedResource]:
#     return handler()["content"]
`;
}

export function generateRubyExport(content: ContentType, encoding: Encoding = 'text'): string {
  let contentHash: string;
  if (content.type === 'rawHtml') {
    contentHash = `{ type: :raw_html, htmlString: '${content.htmlString.replace(/'/g, "\\'")}'  }`;
  } else if (content.type === 'externalUrl') {
    contentHash = `{ type: :external_url, iframeUrl: '${content.iframeUrl}' }`;
  } else {
    contentHash = `{ type: :remote_dom, script: <<~SCRIPT\n${content.script}\nSCRIPT\n, framework: :${content.framework} }`;
  }

  return `# MCP-UI Handler - Ruby
require 'mcp_ui_server'

def handler
  resource = McpUiServer.create_ui_resource(
    uri: 'ui://my-component/instance-1',
    content: ${contentHash},
    encoding: :${encoding}
  )
  
  { content: [resource] }
end

# Usage example:
# server.tool('ui-component', 'Interactive UI') do
#   handler[:content]
# end
`;
}

export function generateExport(
  content: ContentType,
  language: ExportLanguage,
  encoding: Encoding = 'text'
): string {
  switch (language) {
    case 'typescript':
      return generateTypeScriptExport(content, encoding);
    case 'python':
      return generatePythonExport(content, encoding);
    case 'ruby':
      return generateRubyExport(content, encoding);
    default:
      return generateTypeScriptExport(content, encoding);
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
