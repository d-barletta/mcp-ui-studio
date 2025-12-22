// MCP-UI Resource Types (matching real API)
export interface UIResource {
  type: 'resource';
  resource: {
    uri: string;
    mimeType: 'text/html' | 'text/uri-list' | 'application/vnd.mcp-ui.remote-dom';
    text?: string;
    blob?: string;
  };
}

export type ContentType =
  | {
      type: 'rawHtml';
      htmlString: string;
    }
  | {
      type: 'externalUrl';
      iframeUrl: string;
    }
  | {
      type: 'remoteDom';
      script: string;
      framework: 'react' | 'webcomponents';
    };

export type Encoding = 'text' | 'blob';

// Adapter Types
export type AdapterType = 'none' | 'chatgpt' | 'mcp-apps';

export interface ChatGPTAdapterConfig {
  enabled: boolean;
  intentHandling?: 'prompt' | 'tool';
  widgetDescription?: string;
  widgetPrefersBorder?: boolean;
  widgetCSP?: {
    connect_domains?: string[];
    resource_domains?: string[];
  };
}

export interface MCPAppsAdapterConfig {
  enabled: boolean;
}

export interface AdapterConfig {
  type: AdapterType;
  chatgpt?: ChatGPTAdapterConfig;
  mcpApps?: MCPAppsAdapterConfig;
}

// Template Types
export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail?: string;
  content: ContentType;
  previewCode: string;
}

// Export Language Types
export type ExportLanguage = 'typescript' | 'python' | 'ruby';

// Legacy component type for preview rendering
export interface MCPUIComponent {
  type: string;
  props?: Record<string, unknown>;
  children?: MCPUIComponent[] | string;
}

// Component Tree Node
export interface ComponentNode {
  id: string;
  type: string;
  props: Record<string, unknown>;
  children: ComponentNode[];
}

// Studio State
export interface StudioState {
  selectedTemplate: Template | null;
  currentComponent: ComponentNode | null;
  exportLanguage: ExportLanguage;
  isDarkMode: boolean;
}
