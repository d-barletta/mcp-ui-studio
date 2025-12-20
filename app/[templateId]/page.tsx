'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';

// Add custom element type for ui-resource-renderer
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ui-resource-renderer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        resource?: string;
        'remote-dom-props'?: string;
        'html-props'?: string;
        class?: string;
      };
    }
  }
}
import { Template, ContentType } from '@/lib/types';
import { templates } from '@/lib/templates';
import { ExportPanel } from '@/components/export-panel';
import { CodeEditor } from '@/components/code-editor';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Code, Eye, Download, AlertCircle, Terminal, RotateCw } from 'lucide-react';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Logo } from '@/components/logo';
import { UIResourceRenderer, remoteButtonDefinition, remoteTextDefinition } from '@mcp-ui/client';

interface ConsoleMessage {
  id: number;
  timestamp: Date;
  type: 'action' | 'error' | 'info';
  data: any;
}

const generateEditorCode = (content: ContentType): string => {
  let contentStr: string;
  
  if (content.type === 'rawHtml') {
    // Format HTML with template literals
    const htmlLines = content.htmlString.split('\n');
    const indentedHtml = htmlLines.map((line, i) => {
      if (i === 0 && line.trim() === '') return '';
      if (i === htmlLines.length - 1 && line.trim() === '') return '    ';
      return '      ' + line;
    }).join('\n');
    
    contentStr = `{ 
    type: 'rawHtml', 
    htmlString: \`
${indentedHtml}
    \` 
  }`;
  } else if (content.type === 'externalUrl') {
    contentStr = `{ 
    type: 'externalUrl', 
    iframeUrl: '${content.iframeUrl}' 
  }`;
  } else {
    // Remote DOM
    const scriptLines = content.script.split('\n');
    const indentedScript = scriptLines.map((line, i) => {
      if (i === 0 && line.trim() === '') return '';
      if (i === scriptLines.length - 1 && line.trim() === '') return '    ';
      return '      ' + line;
    }).join('\n');
    
    contentStr = `{ 
    type: 'remoteDom', 
    script: \`
${indentedScript}
    \`,
    framework: '${content.framework}'
  }`;
  }

  return `{
  uri: 'ui://my-component/instance-1',
  content: ${contentStr},
  encoding: 'text',
}`;
};

export default function StudioPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.templateId as string;
  
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [editedContent, setEditedContent] = useState<ContentType | null>(null);
  const [editorCode, setEditorCode] = useState<string>('');
  const [contentError, setContentError] = useState<string | null>(null);
  const [rightPanelTab, setRightPanelTab] = useState<'editor' | 'console'>('editor');
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const messageIdCounter = useRef(0);
  const rendererRef = useRef<HTMLElement>(null);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamically load the web component to avoid SSR issues
    // @ts-ignore
    import('@mcp-ui/client/ui-resource-renderer.wc.js');
  }, []);

  useEffect(() => {
    if (templateId) {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        setSelectedTemplate(template);
        setEditedContent(template.content);
        setEditorCode(generateEditorCode(template.content));
      } else {
        // Handle template not found 404
        router.push('/');
      }
    }
  }, [templateId, router]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    setConsoleMessages([]);
    setUnreadCount(0);
  };

  const handleBackToGallery = () => {
    router.push('/');
  };

  const addConsoleMessage = (type: ConsoleMessage['type'], data: any) => {
    messageIdCounter.current += 1;
    const message: ConsoleMessage = {
      id: messageIdCounter.current,
      timestamp: new Date(),
      type,
      data
    };
    setConsoleMessages(prev => [...prev, message]);
    if (rightPanelTab === 'editor') {
      setUnreadCount(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (rightPanelTab === 'console') {
      setUnreadCount(0);
    }
  }, [rightPanelTab]);

  useEffect(() => {
    const element = rendererRef.current;
    if (!element) return;

    const handleAction = (event: any) => {
      const action = event.detail;
      // Filter out internal messages (arrays)
      if (Array.isArray(action)) return;

      console.log('UI Action:', action);
      addConsoleMessage('action', action);
    };

    element.addEventListener('onUIAction', handleAction);
    return () => {
      element.removeEventListener('onUIAction', handleAction);
    };
  }); // Re-bind on every render to capture latest addConsoleMessage closure

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Filter out react-devtools and webpack messages
      if (event.data?.source?.startsWith('react-devtools')) return;
      if (event.data?.type?.startsWith('webpack')) return;

      // Capture tool calls and intents from iframes
      if (event.data && (event.data.type === 'tool' || event.data.type === 'intent')) {
        console.log('Iframe Message:', event.data);
        addConsoleMessage('action', event.data);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  });

  useEffect(() => {
    if (rightPanelTab === 'console') {
      consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleMessages, rightPanelTab]);

  const handleContentChange = (value: string | undefined) => {
    if (!value) return;
    setEditorCode(value);
    
    try {
      // Use Function constructor to parse the JS object literal safely
      // This handles comments, trailing commas, different quoting styles, etc.
      const parseConfig = new Function(`return ${value}`);
      const parsedConfig = parseConfig();
      
      if (!parsedConfig || !parsedConfig.content) {
        setContentError('Invalid MCP-UI schema: missing content object');
        return;
      }
      
      const content = parsedConfig.content;
      
      // Basic MCP-UI schema validation
      if (!content.type) {
        setContentError('Invalid MCP-UI schema: content.type is required');
        return;
      }

      // Trim strings to match previous behavior and avoid excessive whitespace
      if (typeof content.htmlString === 'string') {
        content.htmlString = content.htmlString.trim();
      }
      if (typeof content.script === 'string') {
        content.script = content.script.trim();
      }
      
      // Update the content - let the preview handle rendering
      setEditedContent(content as ContentType);
      setContentError(null);
      setConsoleMessages([]); // Clear console on content update
      setUnreadCount(0);
    } catch (error) {
      setContentError('Invalid UI format');
    }
  };

  if (!selectedTemplate || !editedContent) {
    return null;
  }

  // Use edited content for preview if valid, otherwise fall back to original
  const currentContent = editedContent || selectedTemplate.content;

  return (
    <main className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBackToGallery}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">{selectedTemplate.name}</h1>
            <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <div className="flex items-center gap-2 text-muted-foreground">
            <Logo className="h-4 w-4" />
            <span className="text-sm">MCP UI Studio</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="preview" className="h-full flex flex-col">
          <div className="border-b p-4 bg-muted">
            <TabsList>
              <TabsTrigger value="preview">
                <Eye className="h-4 w-4 mr-2" />
                Split View
              </TabsTrigger>
              <TabsTrigger value="code">
                <Code className="h-4 w-4 mr-2" />
                Code Editor
              </TabsTrigger>
              <TabsTrigger value="export">
                <Download className="h-4 w-4 mr-2" />
                Export
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="preview" className="flex-1 min-h-0 m-0">
            <div className="h-full min-h-0 grid grid-cols-1 lg:grid-cols-2 divide-x">
              {/* Preview Panel */}
              <div className="h-full overflow-hidden">
                <div className="h-full p-4">
                  {currentContent.type === 'rawHtml' && (
                    <div className="w-full h-full border border-border rounded-lg bg-white overflow-auto">
                      <ui-resource-renderer
                        class="w-full h-full block"
                        ref={rendererRef}
                        key={`${currentContent.htmlString}-${refreshKey}`}
                        resource={JSON.stringify({
                          uri: 'ui://preview/html',
                          mimeType: 'text/html',
                          text: currentContent.htmlString
                        })}
                        html-props={JSON.stringify({
                          sandboxPermissions: 'allow-scripts allow-forms allow-modals allow-popups'
                        })}
                      ></ui-resource-renderer>
                    </div>
                  )}
                  {currentContent.type === 'externalUrl' && (
                    <div className="w-full h-full border border-border rounded-lg bg-white overflow-auto">
                      <ui-resource-renderer
                        class="w-full h-full block"
                        ref={rendererRef}
                        key={`${currentContent.iframeUrl}-${refreshKey}`}
                        resource={JSON.stringify({
                          uri: 'ui://preview/url',
                          mimeType: 'text/uri-list',
                          text: currentContent.iframeUrl
                        })}
                        html-props={JSON.stringify({
                          sandboxPermissions: 'allow-scripts allow-forms allow-same-origin allow-modals allow-popups'
                        })}
                      ></ui-resource-renderer>
                    </div>
                  )}
                  {currentContent.type === 'remoteDom' && (
                    <div className="h-full min-h-[320px] border border-border rounded-lg text-slate-100 p-4 flex flex-col">
                      <div className="text-xs text-slate-300 mb-4 pb-2 border-b flex items-center justify-between">
                        <span>Remote DOM Preview</span>
                        <span className="text-[10px] px-2 py-1 bg-green-200 text-green-800 rounded">
                          LIVE
                        </span>
                      </div>
                      <div className="flex-1 overflow-auto rounded border">
                        <ui-resource-renderer
                          class="w-full h-full block"
                          ref={rendererRef}
                          key={`${currentContent.script}-${currentContent.framework}-${refreshKey}`}
                          resource={JSON.stringify({
                            uri: 'ui://remote-component/preview',
                            mimeType: `application/vnd.mcp-ui.remote-dom`,
                            text: currentContent.script
                          })}
                          remote-dom-props={JSON.stringify({
                            remoteElements: [remoteButtonDefinition, remoteTextDefinition]
                          })}
                        ></ui-resource-renderer>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel with Tabs */}
              <div className="h-full min-h-0 flex flex-col">
                <div className="border-b bg-muted/50">
                  <div className="flex">
                    <button
                      onClick={() => setRightPanelTab('editor')}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                        rightPanelTab === 'editor'
                          ? 'bg-background border-b-2 border-primary text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Code className="h-4 w-4 inline-block mr-2" />
                      Editor
                    </button>
                    <button
                      onClick={() => setRightPanelTab('console')}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                        rightPanelTab === 'console'
                          ? 'bg-background border-b-2 border-primary text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Terminal className="h-4 w-4 inline-block mr-2" />
                      Console
                      {unreadCount > 0 && rightPanelTab === 'editor' && (
                        <span className="ml-2 inline-flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-500 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {rightPanelTab === 'editor' ? (
                  <div className="flex-1 min-h-0 flex flex-col">
                    <div className="p-4 border-b bg-muted/50 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">createUIResource Options</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Edit options object (live preview updates)
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRefresh}
                          title="Refresh Preview"
                        >
                          <RotateCw className="h-3 w-3 mr-2" />
                          Refresh
                        </Button>
                        {contentError && (
                          <div className="flex items-center gap-2 text-destructive text-xs">
                            <AlertCircle className="h-4 w-4" />
                            <span>{contentError}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-h-0 overflow-hidden">
                      <CodeEditor
                        code={editorCode}
                        language="typescript"
                        onChange={handleContentChange}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 min-h-0 flex flex-col">
                    <div className="p-4 border-b bg-muted/50 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Console</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          UI actions and events log
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConsoleMessages([])}
                      >
                        Clear
                      </Button>
                    </div>
                    <div className="flex-1 min-h-0 overflow-auto">
                      <div className="p-4 font-mono text-xs space-y-2">
                        {consoleMessages.length === 0 ? (
                          <div className="text-muted-foreground text-center py-8">
                            No messages yet. Interact with the preview to see logs.
                          </div>
                        ) : (
                          consoleMessages.map((msg) => (
                            <div
                              key={msg.id}
                              className="border-b border-border pb-2 last:border-0"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-muted-foreground">
                                  {msg.timestamp.toLocaleTimeString()}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                    msg.type === 'action'
                                      ? 'bg-blue-500/10 text-blue-500'
                                      : msg.type === 'error'
                                      ? 'bg-red-500/10 text-red-500'
                                      : 'bg-gray-500/10 text-gray-500'
                                  }`}
                                >
                                  {msg.type}
                                </span>
                              </div>
                              <pre className="whitespace-pre-wrap break-all text-foreground">
                                {JSON.stringify(msg.data, null, 2)}
                              </pre>
                            </div>
                          ))
                        )}
                        <div ref={consoleEndRef} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="code" className="flex-1 m-0">
            <div className="h-full flex flex-col">
              <div className="p-4 border-b bg-muted/50 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">createUIResource Options</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Edit options object (full screen)
                  </p>
                </div>
                {contentError && (
                  <div className="flex items-center gap-2 text-destructive text-xs">
                    <AlertCircle className="h-4 w-4" />
                    <span>{contentError}</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-h-0">
                <CodeEditor
                  code={editorCode}
                  language="typescript"
                  onChange={handleContentChange}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="export" className="flex-1 m-0 p-0">
            <ScrollArea className="h-full">
              <div className="p-8 max-w-4xl mx-auto">
                <ExportPanel content={currentContent} />
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
