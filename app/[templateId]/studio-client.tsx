'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// Add custom element type for ui-resource-renderer
/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ui-resource-renderer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        resource?: string;
        'remote-dom-props'?: string;
        'html-props'?: string;
        class?: string;
      };
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */
import { Template, ContentType, AdapterConfig } from '@/lib/types';
import { templates } from '@/lib/templates';
import { ExportPanel } from '@/components/export-panel';
import { CodeEditor } from '@/components/code-editor';
import { VisualEditor } from '@/components/visual-editor';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ArrowLeft,
  Code,
  Eye,
  Download,
  AlertCircle,
  Terminal,
  RotateCw,
  Palette,
  Github,
  TrashIcon,
  Maximize2,
  Minimize2,
  Undo,
  Redo,
} from 'lucide-react';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Logo } from '@/components/logo';
import { remoteButtonDefinition, remoteTextDefinition } from '@mcp-ui/client';
import { VisualEditorHandle } from '@/components/visual-editor';

interface ConsoleMessage {
  id: number;
  timestamp: Date;
  type: 'action' | 'error' | 'info';
  data: unknown;
}

const generateEditorCode = (content: ContentType): string => {
  let contentStr: string;

  if (content.type === 'rawHtml') {
    // Format HTML with template literals
    const htmlLines = content.htmlString.split('\n');
    const indentedHtml = htmlLines
      .map((line, i) => {
        if (i === 0 && line.trim() === '') return '';
        if (i === htmlLines.length - 1 && line.trim() === '') return '    ';
        return '      ' + line;
      })
      .join('\n');

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
    const indentedScript = scriptLines
      .map((line, i) => {
        if (i === 0 && line.trim() === '') return '';
        if (i === scriptLines.length - 1 && line.trim() === '') return '    ';
        return '      ' + line;
      })
      .join('\n');

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

export default function StudioClient() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.templateId as string;

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [editedContent, setEditedContent] = useState<ContentType | null>(null);
  const [adapter, setAdapter] = useState<AdapterConfig>({ type: 'none' });
  const [editorCode, setEditorCode] = useState<string>('');
  const [contentError, setContentError] = useState<string | null>(null);
  const [rightPanelTab, setRightPanelTab] = useState<'editor' | 'visual' | 'console'>('visual');
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const visualEditorRef = useRef<VisualEditorHandle>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isMaximized, setIsMaximized] = useState(false);
  const messageIdCounter = useRef(0);
  const rendererRef = useRef<HTMLElement>(null);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamically load the web component to avoid SSR issues
    // @ts-expect-error - Web component module doesn't have TypeScript definitions
    import('@mcp-ui/client/ui-resource-renderer.wc.js');
  }, []);

  useEffect(() => {
    if (templateId) {
      const template = templates.find((t) => t.id === templateId);
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
    setRefreshKey((prev) => prev + 1);
    setConsoleMessages([]);
    setUnreadCount(0);
  };

  const handleBackToGallery = () => {
    router.push('/');
  };

  const addConsoleMessage = (type: ConsoleMessage['type'], data: unknown) => {
    messageIdCounter.current += 1;
    const message: ConsoleMessage = {
      id: messageIdCounter.current,
      timestamp: new Date(),
      type,
      data,
    };
    setConsoleMessages((prev) => [...prev, message]);
    if (rightPanelTab !== 'console') {
      setUnreadCount((prev) => prev + 1);
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

    const handleAction = (event: Event) => {
      const customEvent = event as CustomEvent;
      const action = customEvent.detail;
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
    } catch {
      setContentError('Invalid UI format');
    }
  };

  const handleVisualEditorChange = (config: {
    content: ContentType;
    uri: string;
    encoding: 'text' | 'blob';
    adapter: AdapterConfig;
  }) => {
    setEditedContent(config.content);
    setAdapter(config.adapter);
    setEditorCode(generateEditorCode(config.content));
    setContentError(null);
  };

  if (!selectedTemplate || !editedContent) {
    return null;
  }

  // Use edited content for preview if valid, otherwise fall back to original
  const currentContent = editedContent || selectedTemplate.content;

  return (
    <main className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between gap-4 border-b px-4 py-3">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackToGallery}
            className="aspect-square shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">{selectedTemplate.name}</h1>
            <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://github.com/d-barletta/mcp-ui-studio"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
          </Button>
          <ThemeSwitcher />
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center gap-2 text-muted-foreground transition-colors hover:text-foreground md:h-auto md:w-auto md:pl-2"
          >
            <Logo className="aspect-square h-4 w-4 shrink-0" />
            <span className="hidden text-sm md:inline">MCP UI Studio</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="preview" className="flex h-full flex-col">
          <div className="border-b bg-muted p-4">
            <TabsList>
              <TabsTrigger value="preview">
                <Eye className="mr-2 h-4 w-4" />
                Split View
              </TabsTrigger>
              <TabsTrigger value="code">
                <Code className="mr-2 h-4 w-4" />
                Code Editor
              </TabsTrigger>
              <TabsTrigger value="export">
                <Download className="mr-2 h-4 w-4" />
                Export
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="preview" className="m-0 min-h-0 flex-1">
            <div
              className={`grid h-full min-h-0 divide-y lg:grid-cols-2 lg:grid-rows-none lg:divide-x lg:divide-y-0 ${isMaximized ? 'grid-rows-1' : 'grid-rows-2'}`}
            >
              {/* Preview Panel */}
              <div className={`h-full overflow-hidden ${isMaximized ? 'hidden lg:block' : ''}`}>
                <div className="h-full p-4">
                  {currentContent.type === 'rawHtml' && (
                    <div className="h-full w-full overflow-auto rounded-lg border border-border bg-white">
                      <ui-resource-renderer
                        class="block h-full w-full"
                        ref={rendererRef}
                        key={`${currentContent.htmlString}-${refreshKey}`}
                        resource={JSON.stringify({
                          uri: 'ui://preview/html',
                          mimeType: 'text/html',
                          text: currentContent.htmlString,
                        })}
                        html-props={JSON.stringify({
                          sandboxPermissions: 'allow-scripts allow-forms allow-modals allow-popups',
                        })}
                      ></ui-resource-renderer>
                    </div>
                  )}
                  {currentContent.type === 'externalUrl' && (
                    <div className="h-full w-full overflow-auto rounded-lg border border-border bg-white">
                      <ui-resource-renderer
                        class="block h-full w-full"
                        ref={rendererRef}
                        key={`${currentContent.iframeUrl}-${refreshKey}`}
                        resource={JSON.stringify({
                          uri: 'ui://preview/url',
                          mimeType: 'text/uri-list',
                          text: currentContent.iframeUrl,
                        })}
                        html-props={JSON.stringify({
                          sandboxPermissions:
                            'allow-scripts allow-forms allow-same-origin allow-modals allow-popups',
                        })}
                      ></ui-resource-renderer>
                    </div>
                  )}
                  {currentContent.type === 'remoteDom' && (
                    <div className="flex h-full flex-col rounded-lg border border-border p-4 text-slate-100">
                      <div className="mb-4 flex items-center justify-between text-xs text-slate-300">
                        <span>Remote DOM Preview</span>
                        <span className="rounded bg-green-200 px-2 py-1 text-[10px] text-green-800">
                          LIVE
                        </span>
                      </div>
                      <div className="flex-1 overflow-auto rounded border">
                        <ui-resource-renderer
                          class="block h-full w-full"
                          ref={rendererRef}
                          key={`${currentContent.script}-${currentContent.framework}-${refreshKey}`}
                          resource={JSON.stringify({
                            uri: 'ui://remote-component/preview',
                            mimeType: `application/vnd.mcp-ui.remote-dom`,
                            text: currentContent.script,
                          })}
                          remote-dom-props={JSON.stringify({
                            remoteElements: [remoteButtonDefinition, remoteTextDefinition],
                          })}
                        ></ui-resource-renderer>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel with Tabs */}
              <div className="flex h-full min-h-0 flex-col">
                <div className="border-b bg-muted/50">
                  <div className="flex">
                    <button
                      onClick={() => setRightPanelTab('visual')}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                        rightPanelTab === 'visual'
                          ? 'border-b-2 border-primary bg-background text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Palette className="mr-2 inline-block h-4 w-4" />
                      Visual
                    </button>
                    <button
                      onClick={() => setRightPanelTab('editor')}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                        rightPanelTab === 'editor'
                          ? 'border-b-2 border-primary bg-background text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Code className="mr-2 inline-block h-4 w-4" />
                      Editor
                    </button>
                    <button
                      onClick={() => setRightPanelTab('console')}
                      className={`relative flex-1 whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors ${
                        rightPanelTab === 'console'
                          ? 'border-b-2 border-primary bg-background text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Terminal className="mr-2 inline-block h-4 w-4" />
                      Console
                      {unreadCount > 0 && rightPanelTab !== 'console' && (
                        <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {rightPanelTab === 'visual' && (
                  <div className="flex min-h-0 flex-1 flex-col">
                    <div className="flex items-center justify-between border-b bg-muted/50 p-4">
                      <div>
                        <h3 className="font-semibold">Visual Editor</h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Configure UI properties
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => visualEditorRef.current?.undo()}
                          disabled={!canUndo}
                          title="Undo"
                        >
                          <Undo className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => visualEditorRef.current?.redo()}
                          disabled={!canRedo}
                          title="Redo"
                        >
                          <Redo className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="lg:hidden"
                          onClick={() => setIsMaximized(!isMaximized)}
                          title={isMaximized ? 'Minimize' : 'Maximize'}
                        >
                          {isMaximized ? (
                            <Minimize2 className="h-4 w-4" />
                          ) : (
                            <Maximize2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="min-h-0 flex-1 overflow-auto">
                      <VisualEditor
                        ref={visualEditorRef}
                        content={currentContent}
                        uri="ui://my-component/instance-1"
                        encoding="text"
                        adapter={adapter}
                        onChange={handleVisualEditorChange}
                        onHistoryChange={(undo, redo) => {
                          setCanUndo(undo);
                          setCanRedo(redo);
                        }}
                      />
                    </div>
                  </div>
                )}

                {rightPanelTab === 'editor' && (
                  <div className="flex min-h-0 flex-1 flex-col">
                    <div className="flex items-center justify-between border-b bg-muted/50 p-4">
                      <div>
                        <h3 className="font-semibold">createUIResource Options</h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Edit options object (live preview)
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {contentError && (
                          <div className="flex items-center gap-2 rounded bg-red-500/10 px-2 py-1 text-xs font-semibold text-red-500">
                            <AlertCircle className="h-4 w-4" />
                            <span>{contentError}</span>
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRefresh}
                          title="Refresh Preview"
                        >
                          <RotateCw className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="lg:hidden"
                          onClick={() => setIsMaximized(!isMaximized)}
                          title={isMaximized ? 'Minimize' : 'Maximize'}
                        >
                          {isMaximized ? (
                            <Minimize2 className="h-4 w-4" />
                          ) : (
                            <Maximize2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="min-h-0 flex-1 overflow-hidden">
                      <CodeEditor
                        code={editorCode}
                        language="typescript"
                        onChange={handleContentChange}
                      />
                    </div>
                  </div>
                )}

                {rightPanelTab === 'console' && (
                  <div className="flex min-h-0 flex-1 flex-col">
                    <div className="flex items-center justify-between border-b bg-muted/50 p-4">
                      <div>
                        <h3 className="font-semibold">Console</h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          UI actions and events log
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setConsoleMessages([])}
                          title="Clear"
                        >
                          <TrashIcon className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="lg:hidden"
                          onClick={() => setIsMaximized(!isMaximized)}
                          title={isMaximized ? 'Minimize' : 'Maximize'}
                        >
                          {isMaximized ? (
                            <Minimize2 className="h-4 w-4" />
                          ) : (
                            <Maximize2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="min-h-0 flex-1 overflow-auto">
                      <div className="space-y-2 p-4 font-mono text-xs">
                        {consoleMessages.length === 0 ? (
                          <div className="py-8 text-center text-muted-foreground">
                            No messages yet. Interact with the preview to see logs.
                          </div>
                        ) : (
                          consoleMessages.map((msg) => (
                            <div key={msg.id} className="border-b border-border pb-2 last:border-0">
                              <div className="mb-1 flex items-center gap-2">
                                <span className="text-muted-foreground">
                                  {msg.timestamp.toLocaleTimeString()}
                                </span>
                                <span
                                  className={`rounded px-2 py-0.5 text-xs font-semibold ${
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

          <TabsContent value="code" className="m-0 flex-1">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b bg-muted/50 p-4">
                <div>
                  <h3 className="font-semibold">createUIResource Options</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Edit options object (full screen)
                  </p>
                </div>
                {contentError && (
                  <div className="flex items-center gap-2 rounded bg-red-500/10 px-2 py-1 text-xs font-semibold text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    <span>{contentError}</span>
                  </div>
                )}
              </div>
              <div className="min-h-0 flex-1">
                <CodeEditor
                  code={editorCode}
                  language="typescript"
                  onChange={handleContentChange}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="export" className="m-0 min-h-0 flex-1 p-0">
            <ScrollArea className="h-full">
              <div className="mx-auto max-w-4xl p-0 md:p-8">
                <ExportPanel content={currentContent} adapter={adapter} />
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
