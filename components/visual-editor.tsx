'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { ContentType } from '@/lib/types';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AlertCircle } from 'lucide-react';

// Dynamically import Monaco to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-muted">
      <p className="text-muted-foreground">Loading editor...</p>
    </div>
  ),
});

interface VisualEditorProps {
  content: ContentType;
  uri?: string;
  encoding?: 'text' | 'blob';
  onChange: (config: { content: ContentType; uri: string; encoding: 'text' | 'blob' }) => void;
}

export function VisualEditor({ content, uri = 'ui://my-component/instance-1', encoding = 'text', onChange }: VisualEditorProps) {
  const [currentUri, setCurrentUri] = useState(uri);
  const [currentEncoding, setCurrentEncoding] = useState<'text' | 'blob'>(encoding);
  const [currentContentType, setCurrentContentType] = useState<'rawHtml' | 'externalUrl' | 'remoteDom'>(content.type);
  
  // Content-specific state
  const [htmlString, setHtmlString] = useState(content.type === 'rawHtml' ? content.htmlString : '');
  const [iframeUrl, setIframeUrl] = useState(content.type === 'externalUrl' ? content.iframeUrl : '');
  const [script, setScript] = useState(content.type === 'remoteDom' ? content.script : '');
  const [framework, setFramework] = useState<'react' | 'webcomponents'>(
    content.type === 'remoteDom' ? content.framework : 'react'
  );
  
  const [htmlError, setHtmlError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(12);

  useEffect(() => {
    const handleResize = () => {
      setFontSize(window.innerWidth < 768 ? 10 : 12);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Build and emit the content change
  const emitChange = useCallback((
    contentType: 'rawHtml' | 'externalUrl' | 'remoteDom',
    html: string,
    url: string,
    scr: string,
    fw: 'react' | 'webcomponents',
    uri: string,
    enc: 'text' | 'blob'
  ) => {
    let newContent: ContentType;
    
    if (contentType === 'rawHtml') {
      newContent = { type: 'rawHtml', htmlString: html };
    } else if (contentType === 'externalUrl') {
      newContent = { type: 'externalUrl', iframeUrl: url };
    } else {
      newContent = { type: 'remoteDom', script: scr, framework: fw };
    }
    
    onChange({
      content: newContent,
      uri,
      encoding: enc,
    });
  }, [onChange]);

  // Sync with external content changes (only when prop changes)
  useEffect(() => {
    setCurrentContentType(content.type);
    if (content.type === 'rawHtml') {
      setHtmlString(content.htmlString);
    } else if (content.type === 'externalUrl') {
      setIframeUrl(content.iframeUrl);
    } else if (content.type === 'remoteDom') {
      setScript(content.script);
      setFramework(content.framework);
    }
  }, [content]);

  const handleContentTypeChange = (value: string) => {
    const newType = value as 'rawHtml' | 'externalUrl' | 'remoteDom';
    setCurrentContentType(newType);
    emitChange(newType, htmlString, iframeUrl, script, framework, currentUri, currentEncoding);
  };

  const handleUriChange = (value: string) => {
    setCurrentUri(value);
    emitChange(currentContentType, htmlString, iframeUrl, script, framework, value, currentEncoding);
  };

  const handleEncodingChange = (value: 'text' | 'blob') => {
    setCurrentEncoding(value);
    emitChange(currentContentType, htmlString, iframeUrl, script, framework, currentUri, value);
  };

  const handleIframeUrlChange = (value: string) => {
    setIframeUrl(value);
    emitChange(currentContentType, htmlString, value, script, framework, currentUri, currentEncoding);
  };

  const handleFrameworkChange = (value: 'react' | 'webcomponents') => {
    setFramework(value);
    emitChange(currentContentType, htmlString, iframeUrl, script, value, currentUri, currentEncoding);
  };

  const handleScriptChange = (value: string | undefined) => {
    if (value === undefined) return;
    setScript(value);
    emitChange(currentContentType, htmlString, iframeUrl, value, framework, currentUri, currentEncoding);
  };

  const handleHtmlChange = (value: string | undefined) => {
    if (value === undefined) return;
    setHtmlString(value);
    
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

    emitChange(currentContentType, value, iframeUrl, script, framework, currentUri, currentEncoding);
  };

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

  return (
    <div className="h-full flex flex-col overflow-y-auto md:overflow-hidden">
      {/* Configuration Panel */}
      <div className="p-4 border-b space-y-4 bg-muted/50 shrink-0">
        <div>
          <div className="grid grid-cols-1 gap-4">
            {/* URI Field */}
            <div className="space-y-2">
              <Label htmlFor="uri">Resource URI</Label>
              <Input
                id="uri"
                type="text"
                value={currentUri}
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
              <Select value={currentContentType} onValueChange={handleContentTypeChange}>
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
                {currentContentType === 'rawHtml' && 'Render HTML string in sandboxed iframe'}
                {currentContentType === 'externalUrl' && 'Load external URL in iframe'}
                {currentContentType === 'remoteDom' && 'Execute remote DOM script'}
              </p>
            </div>

            {/* Encoding Selector */}
            <div className="space-y-2">
              <Label htmlFor="encoding">Encoding</Label>
              <Select value={currentEncoding} onValueChange={handleEncodingChange}>
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

            {/* External URL Input (only for externalUrl type) */}
            {currentContentType === 'externalUrl' && (
              <div className="space-y-2">
                <Label htmlFor="iframeUrl">External URL</Label>
                <Input
                  id="iframeUrl"
                  type="url"
                  value={iframeUrl}
                  onChange={(e) => handleIframeUrlChange(e.target.value)}
                  placeholder="https://example.com/dashboard"
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  URL to load in the iframe
                </p>
              </div>
            )}

            {/* Framework Selector (only for remoteDom type) */}
            {currentContentType === 'remoteDom' && (
              <div className="space-y-2">
                <Label htmlFor="framework">Framework</Label>
                <Select value={framework} onValueChange={handleFrameworkChange}>
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

      {/* Content Editor */}
      <div className="flex-1 min-h-[300px] md:min-h-0 flex flex-col">
        <div className="p-4 border-b bg-muted/50 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">
              {currentContentType === 'rawHtml' && 'HTML Content'}
              {currentContentType === 'externalUrl' && 'External URL Configuration'}
              {currentContentType === 'remoteDom' && 'Remote DOM Script'}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {currentContentType === 'rawHtml' && 'Edit your HTML content with syntax validation'}
              {currentContentType === 'externalUrl' && 'Configure the external URL in the fields above'}
              {currentContentType === 'remoteDom' && 'Edit your remote DOM script'}
            </p>
          </div>
          {htmlError && currentContentType === 'rawHtml' && (
            <div className="flex items-center gap-2 text-destructive text-xs">
              <AlertCircle className="h-4 w-4" />
              <span>{htmlError}</span>
            </div>
          )}
        </div>

        {currentContentType === 'rawHtml' && (
          <div className="flex-1 min-h-0">
            <MonacoEditor
              height="100%"
              language="html"
              value={htmlString}
              onChange={handleHtmlChange}
              theme="vs-dark"
              beforeMount={handleEditorWillMount}
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

        {currentContentType === 'externalUrl' && (
          <div className="flex-1 min-h-0 p-8">
            <Card>
              <CardHeader>
                <CardTitle>External URL Configuration</CardTitle>
                <CardDescription>
                  The external URL will be loaded in an iframe. Configure the URL in the fields above.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted rounded-md">
                  <p className="text-sm font-mono break-all">{iframeUrl || 'No URL specified'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentContentType === 'remoteDom' && (
          <div className="flex-1 min-h-0">
            <MonacoEditor
              height="100%"
              language="javascript"
              value={script}
              onChange={handleScriptChange}
              theme="vs-dark"
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
