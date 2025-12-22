'use client';

import { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import dynamic from 'next/dynamic';
import { ContentType, AdapterConfig, AdapterType } from '@/lib/types';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AlertCircle, Maximize2, Minimize2 } from 'lucide-react';

// Dynamically import Monaco to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-muted">
      <p className="text-muted-foreground">Loading editor...</p>
    </div>
  ),
});

export interface VisualEditorHandle {
  undo: () => void;
  redo: () => void;
}

interface VisualEditorProps {
  content: ContentType;
  uri?: string;
  encoding?: 'text' | 'blob';
  adapter?: AdapterConfig;
  onChange: (config: {
    content: ContentType;
    uri: string;
    encoding: 'text' | 'blob';
    adapter: AdapterConfig;
  }) => void;
  onHistoryChange?: (canUndo: boolean, canRedo: boolean) => void;
}

interface VisualEditorState {
  uri: string;
  encoding: 'text' | 'blob';
  contentType: 'rawHtml' | 'externalUrl' | 'remoteDom';
  htmlString: string;
  iframeUrl: string;
  script: string;
  framework: 'react' | 'webcomponents';
  adapter: AdapterConfig;
}

export const VisualEditor = forwardRef<VisualEditorHandle, VisualEditorProps>(
  (
    {
      content,
      uri = 'ui://my-component/instance-1',
      encoding = 'text',
      adapter = { type: 'none' },
      onChange,
      onHistoryChange,
    },
    ref
  ) => {
    // Initial state
    const initialState: VisualEditorState = {
      uri,
      encoding,
      contentType: content.type,
      htmlString: content.type === 'rawHtml' ? content.htmlString : '',
      iframeUrl: content.type === 'externalUrl' ? content.iframeUrl : '',
      script: content.type === 'remoteDom' ? content.script : '',
      framework: content.type === 'remoteDom' ? content.framework : 'react',
      adapter,
    };

    const [state, setState] = useState<VisualEditorState>(initialState);
    const [history, setHistory] = useState<VisualEditorState[]>([]);
    const [future, setFuture] = useState<VisualEditorState[]>([]);

    const [htmlError, setHtmlError] = useState<string | null>(null);
    const [fontSize, setFontSize] = useState(12);
    const [isEditorExpanded, setIsEditorExpanded] = useState(false);
    const editorRef = useRef<any>(null);

    useEffect(() => {
      const handleResize = () => {
        setFontSize(window.innerWidth < 768 ? 10 : 12);
      };

      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Update state and history
    const updateState = (newState: Partial<VisualEditorState>, addToHistory = true) => {
      if (addToHistory) {
        setHistory((prev) => [...prev, state]);
        setFuture([]);
      }

      const updatedState = { ...state, ...newState };
      setState(updatedState);

      // Emit change
      let newContent: ContentType;
      if (updatedState.contentType === 'rawHtml') {
        newContent = { type: 'rawHtml', htmlString: updatedState.htmlString };
      } else if (updatedState.contentType === 'externalUrl') {
        newContent = { type: 'externalUrl', iframeUrl: updatedState.iframeUrl };
      } else {
        newContent = {
          type: 'remoteDom',
          script: updatedState.script,
          framework: updatedState.framework,
        };
      }

      onChange({
        content: newContent,
        uri: updatedState.uri,
        encoding: updatedState.encoding,
        adapter: updatedState.adapter,
      });
    };

    // Sync with external content changes (only when prop changes)
    useEffect(() => {
      // Only update if the content is different from current state to avoid loops
      // This is a simplified check
      if (content.type !== state.contentType) {
        // External update logic if needed, but usually we drive state from here
      }
    }, [content]);

    const handleContentTypeChange = (value: string) => {
      updateState({ contentType: value as any });
    };

    const handleUriChange = (value: string) => {
      updateState({ uri: value });
    };

    const handleEncodingChange = (value: 'text' | 'blob') => {
      updateState({ encoding: value });
    };

    const handleIframeUrlChange = (value: string) => {
      updateState({ iframeUrl: value });
    };

    const handleFrameworkChange = (value: 'react' | 'webcomponents') => {
      updateState({ framework: value });
    };

    const handleAdapterTypeChange = (value: AdapterType) => {
      const newAdapter: AdapterConfig = { type: value };
      if (value === 'chatgpt') {
        newAdapter.chatgpt = {
          enabled: true,
          intentHandling: 'prompt',
          widgetPrefersBorder: true,
        };
      } else if (value === 'mcp-apps') {
        newAdapter.mcpApps = { enabled: true };
      }
      updateState({ adapter: newAdapter });
    };

    const handleChatGPTConfigChange = (
      field: keyof NonNullable<AdapterConfig['chatgpt']>,
      value: any
    ) => {
      updateState({
        adapter: {
          ...state.adapter,
          chatgpt: {
            ...state.adapter.chatgpt,
            enabled: true,
            [field]: value,
          },
        },
      });
    };

    const handleScriptChange = (value: string | undefined) => {
      if (value === undefined) return;
      // For editor changes, we might want to debounce history updates or handle them differently
      // For now, we'll just update state without adding to history for every keystroke
      // Ideally, we'd add to history on blur or after a pause
      updateState({ script: value }, false);
    };

    const handleHtmlChange = (value: string | undefined) => {
      if (value === undefined) return;

      // Basic HTML validation
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(value, 'text/html');
        const parseErrors = doc.querySelector('parsererror');

        if (parseErrors) {
          setHtmlError('Invalid HTML structure');
        } else {
          setHtmlError(null);
        }
      } catch (error) {
        setHtmlError('HTML parsing error');
      }

      updateState({ htmlString: value }, false);
    };

    // Save editor state to history on blur or specific actions if needed
    // For now, we rely on manual state updates for non-editor fields

    const handleEditorWillMount = (monaco: any) => {
      // Configure HTML validation
      monaco.languages.html.htmlDefaults.setOptions({
        format: {
          tabSize: 2,
          insertSpaces: true,
          wrapLineLength: 120,
          unformatted: 'wbr',
        },
        suggest: { html5: true },
      });
    };

    const handleEditorDidMount = (editor: any) => {
      editorRef.current = editor;

      // Add history entry when editor content changes (debounced or on blur could be better)
      // But since we disabled history for onChange, we need a way to capture it.
      // Let's capture on blur for now
      editor.onDidBlurEditorText(() => {
        setHistory((prev) => [...prev, state]);
      });
    };

    const handleUndo = () => {
      if (history.length === 0) return;
      const previous = history[history.length - 1];
      const newHistory = history.slice(0, -1);

      setFuture((prev) => [state, ...prev]);
      setHistory(newHistory);
      setState(previous);

      // Emit change for undo
      let newContent: ContentType;
      if (previous.contentType === 'rawHtml') {
        newContent = { type: 'rawHtml', htmlString: previous.htmlString };
      } else if (previous.contentType === 'externalUrl') {
        newContent = { type: 'externalUrl', iframeUrl: previous.iframeUrl };
      } else {
        newContent = { type: 'remoteDom', script: previous.script, framework: previous.framework };
      }

      onChange({
        content: newContent,
        uri: previous.uri,
        encoding: previous.encoding,
        adapter: previous.adapter,
      });
    };

    const handleRedo = () => {
      if (future.length === 0) return;
      const next = future[0];
      const newFuture = future.slice(1);

      setHistory((prev) => [...prev, state]);
      setFuture(newFuture);
      setState(next);

      // Emit change for redo
      let newContent: ContentType;
      if (next.contentType === 'rawHtml') {
        newContent = { type: 'rawHtml', htmlString: next.htmlString };
      } else if (next.contentType === 'externalUrl') {
        newContent = { type: 'externalUrl', iframeUrl: next.iframeUrl };
      } else {
        newContent = { type: 'remoteDom', script: next.script, framework: next.framework };
      }

      onChange({
        content: newContent,
        uri: next.uri,
        encoding: next.encoding,
        adapter: next.adapter,
      });
    };

    useImperativeHandle(ref, () => ({
      undo: handleUndo,
      redo: handleRedo,
    }));

    useEffect(() => {
      onHistoryChange?.(history.length > 0, future.length > 0);
    }, [history, future, onHistoryChange]);

    return (
      <div className="flex h-full flex-col overflow-y-auto">
        {/* Configuration Panel */}
        {!isEditorExpanded && (
          <div className="shrink-0 space-y-4 border-b bg-muted/50 p-4">
            <div>
              <div className="grid grid-cols-1 gap-4">
                {/* URI Field */}
                <div className="space-y-2">
                  <Label htmlFor="uri">Resource URI</Label>
                  <Input
                    id="uri"
                    type="text"
                    value={state.uri}
                    onChange={(e) => handleUriChange(e.target.value)}
                    placeholder="ui://my-component/instance-1"
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Unique identifier for this UI resource
                  </p>
                </div>

                {/* Content Type Selector */}
                <div className="space-y-2">
                  <Label htmlFor="contentType">Content Type</Label>
                  <Select value={state.contentType} onValueChange={handleContentTypeChange}>
                    <SelectTrigger id="contentType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rawHtml">Raw HTML</SelectItem>
                      <SelectItem value="externalUrl">External URL (iframe)</SelectItem>
                      <SelectItem value="remoteDom">Remote DOM</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {state.contentType === 'rawHtml' && 'Render HTML string in sandboxed iframe'}
                    {state.contentType === 'externalUrl' && 'Load external URL in iframe'}
                    {state.contentType === 'remoteDom' && 'Execute remote DOM script'}
                  </p>
                </div>

                {/* Encoding Selector */}
                <div className="space-y-2">
                  <Label htmlFor="encoding">Encoding</Label>
                  <Select value={state.encoding} onValueChange={handleEncodingChange}>
                    <SelectTrigger id="encoding">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="blob">Blob (Base64)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Text for direct content, Blob for base64-encoded content
                  </p>
                </div>

                {/* Adapter Selector */}
                <div className="space-y-2">
                  <Label htmlFor="adapter">Adapter</Label>
                  <Select value={state.adapter.type} onValueChange={handleAdapterTypeChange}>
                    <SelectTrigger id="adapter">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Standard MCP-UI)</SelectItem>
                      <SelectItem value="chatgpt">ChatGPT Apps SDK</SelectItem>
                      <SelectItem value="mcp-apps">MCP Apps</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {state.adapter.type === 'none' && 'Standard MCP-UI protocol'}
                    {state.adapter.type === 'chatgpt' &&
                      'Enable ChatGPT Apps SDK adapter with bridge script'}
                    {state.adapter.type === 'mcp-apps' &&
                      'Enable MCP Apps SEP protocol translation'}
                  </p>
                </div>

                {/* ChatGPT Adapter Configuration */}
                {state.adapter.type === 'chatgpt' && state.adapter.chatgpt && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">ChatGPT Apps SDK Options</CardTitle>
                      <CardDescription className="text-xs">
                        Configure ChatGPT-specific metadata and behavior
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="widgetDescription">Widget Description</Label>
                        <Input
                          id="widgetDescription"
                          type="text"
                          value={state.adapter.chatgpt.widgetDescription || ''}
                          onChange={(e) =>
                            handleChatGPTConfigChange('widgetDescription', e.target.value)
                          }
                          placeholder="Interactive calculator"
                          className="text-sm"
                        />
                        <p className="text-xs text-muted-foreground">
                          Description shown in ChatGPT
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="intentHandling">Intent Handling</Label>
                        <Select
                          value={state.adapter.chatgpt.intentHandling || 'prompt'}
                          onValueChange={(v) => handleChatGPTConfigChange('intentHandling', v)}
                        >
                          <SelectTrigger id="intentHandling">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="prompt">Prompt</SelectItem>
                            <SelectItem value="tool">Tool</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          How user intents are handled
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="widgetPrefersBorder"
                          checked={state.adapter.chatgpt.widgetPrefersBorder !== false}
                          onChange={(e) =>
                            handleChatGPTConfigChange('widgetPrefersBorder', e.target.checked)
                          }
                          className="h-4 w-4"
                        />
                        <Label htmlFor="widgetPrefersBorder" className="text-sm font-normal">
                          Widget prefers border
                        </Label>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* MCP Apps Adapter Info */}
                {state.adapter.type === 'mcp-apps' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">MCP Apps SEP</CardTitle>
                      <CardDescription className="text-xs">
                        Protocol translation enabled
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        The adapter automatically translates MCP-UI protocol messages to MCP Apps
                        SEP JSON-RPC format. Your widget communicates via postMessage and the
                        adapter handles the protocol translation seamlessly.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* External URL Input (only for externalUrl type) */}
                {state.contentType === 'externalUrl' && (
                  <div className="space-y-2">
                    <Label htmlFor="iframeUrl">External URL</Label>
                    <Input
                      id="iframeUrl"
                      type="url"
                      value={state.iframeUrl}
                      onChange={(e) => handleIframeUrlChange(e.target.value)}
                      placeholder="https://example.com/dashboard"
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">URL to load in the iframe</p>
                  </div>
                )}

                {/* Framework Selector (only for remoteDom type) */}
                {state.contentType === 'remoteDom' && (
                  <div className="space-y-2">
                    <Label htmlFor="framework">Framework</Label>
                    <Select value={state.framework} onValueChange={handleFrameworkChange}>
                      <SelectTrigger id="framework">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="react">React</SelectItem>
                        <SelectItem value="webcomponents">Web Components</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Framework used in the remote DOM script
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content Editor */}
        <div className={`flex flex-1 flex-col ${isEditorExpanded ? 'h-full' : 'min-h-[500px]'}`}>
          <div className="flex items-center justify-between border-b bg-muted/50 p-4">
            <div>
              <h3 className="font-semibold">
                {state.contentType === 'rawHtml' && 'HTML Content'}
                {state.contentType === 'externalUrl' && 'External URL Configuration'}
                {state.contentType === 'remoteDom' && 'Remote DOM Script'}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {state.contentType === 'rawHtml' && 'Edit your HTML content with syntax validation'}
                {state.contentType === 'externalUrl' &&
                  'Configure the external URL in the fields above'}
                {state.contentType === 'remoteDom' && 'Edit your remote DOM script'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {htmlError && state.contentType === 'rawHtml' && (
                <div className="mr-2 flex items-center gap-2 text-xs text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{htmlError}</span>
                </div>
              )}
              {state.contentType !== 'externalUrl' && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditorExpanded(!isEditorExpanded)}
                  title={isEditorExpanded ? 'Collapse' : 'Expand'}
                >
                  {isEditorExpanded ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </div>

          {state.contentType === 'rawHtml' && (
            <div className="min-h-0 flex-1">
              <MonacoEditor
                height="100%"
                language="html"
                value={state.htmlString}
                onChange={handleHtmlChange}
                theme="vs-dark"
                beforeMount={handleEditorWillMount}
                onMount={handleEditorDidMount}
                options={{
                  minimap: { enabled: false },
                  fontSize,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: 'on',
                }}
              />
            </div>
          )}

          {state.contentType === 'externalUrl' && (
            <div className="flex-1 p-2">
              <Card>
                <CardHeader>
                  <CardTitle>External URL Configuration</CardTitle>
                  <CardDescription>
                    The external URL will be loaded in an iframe. Configure the URL in the fields
                    above.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md bg-muted p-4">
                    <p className="break-all font-mono text-sm">
                      {state.iframeUrl || 'No URL specified'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {state.contentType === 'remoteDom' && (
            <div className="min-h-0 flex-1">
              <MonacoEditor
                height="100%"
                language="javascript"
                value={state.script}
                onChange={handleScriptChange}
                theme="vs-dark"
                onMount={handleEditorDidMount}
                options={{
                  minimap: { enabled: false },
                  fontSize,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
);
