// MCP-UI Component Types
export interface MCPUIComponent {
  type: string;
  props?: Record<string, unknown>;
  children?: MCPUIComponent[] | string;
}

// Template Types
export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail?: string;
  mcpui: MCPUIComponent;
  previewCode: string;
}

// Export Language Types
export type ExportLanguage = 'typescript' | 'python' | 'ruby';

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
