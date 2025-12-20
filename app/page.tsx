'use client';

import { useState } from 'react';
import { Template, ContentType } from '@/lib/types';
import { TemplateGallery } from '@/components/template-gallery';
import { LivePreview } from '@/components/live-preview';
import { ExportPanel } from '@/components/export-panel';
import { CodeEditor } from '@/components/code-editor';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Code, Eye, Download, AlertCircle } from 'lucide-react';
import { ThemeSwitcher } from '@/components/theme-switcher';

export default function StudioPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [editedContent, setEditedContent] = useState<ContentType | null>(null);
  const [contentError, setContentError] = useState<string | null>(null);
  const [view, setView] = useState<'gallery' | 'studio'>('gallery');

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setEditedContent(template.content);
    setContentError(null);
    setView('studio');
  };

  const handleBackToGallery = () => {
    setView('gallery');
  };

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

  const handleContentChange = (value: string | undefined) => {
    if (!value) return;
    
    try {
      // Convert template literals to JSON strings for parsing
      let normalizedValue = value;
      
      // Extract content object
      const contentMatch = normalizedValue.match(/content:\s*\{[\s\S]*?\n  \}/);
      if (!contentMatch) {
        setContentError('Cannot find content object');
        return;
      }
      
      let contentStr = contentMatch[0].replace(/content:\s*/, '');
      
      // Replace template literals with JSON strings
      contentStr = contentStr.replace(/htmlString:\s*`([^`]*)`/s, (_, html) => {
        const trimmedHtml = html.trim();
        return `"htmlString": ${JSON.stringify(trimmedHtml)}`;
      });
      
      contentStr = contentStr.replace(/script:\s*`([^`]*)`/s, (_, script) => {
        const trimmedScript = script.trim();
        return `"script": ${JSON.stringify(trimmedScript)}`;
      });
      
      // Replace single quotes with double quotes for JSON
      contentStr = contentStr.replace(/type:\s*'(\w+)'/g, '"type": "$1"');
      contentStr = contentStr.replace(/iframeUrl:\s*'([^']+)'/g, '"iframeUrl": "$1"');
      contentStr = contentStr.replace(/framework:\s*'(\w+)'/g, '"framework": "$1"');
      
      const parsed = JSON.parse(contentStr);
      
      // Validate the parsed content matches ContentType structure
      if (!parsed.type || !['rawHtml', 'externalUrl', 'remoteDom'].includes(parsed.type)) {
        setContentError('Invalid content type. Must be: rawHtml, externalUrl, or remoteDom');
        return;
      }
      
      if (parsed.type === 'rawHtml' && !parsed.htmlString) {
        setContentError('rawHtml requires htmlString property');
        return;
      }
      
      if (parsed.type === 'externalUrl' && !parsed.iframeUrl) {
        setContentError('externalUrl requires iframeUrl property');
        return;
      }
      
      if (parsed.type === 'remoteDom') {
        if (!parsed.script || !parsed.framework) {
          setContentError('remoteDom requires script and framework properties');
          return;
        }
        if (!['react', 'webcomponents'].includes(parsed.framework)) {
          setContentError('framework must be: react or webcomponents');
          return;
        }
      }
      
      setEditedContent(parsed as ContentType);
      setContentError(null);
    } catch (error) {
      setContentError('Invalid syntax. Check your code structure.');
    }
  };

  if (view === 'gallery') {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto py-8 px-4">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">MCP UI Studio</h1>
              <p className="text-lg text-muted-foreground">
                Professional visual development environment for MCP-UI interfaces
              </p>
            </div>
            <ThemeSwitcher />
          </div>
          <TemplateGallery onSelectTemplate={handleSelectTemplate} />
        </div>
      </main>
    );
  }

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
          <span className="text-sm text-muted-foreground">MCP UI Studio</span>
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

          <TabsContent value="preview" className="flex-1 m-0">
            <div className="h-full grid grid-cols-1 lg:grid-cols-2 divide-x">
              {/* Preview Panel */}
              <div className="h-full overflow-hidden">
                <div className="h-full p-4">
                  {currentContent.type === 'rawHtml' && (
                    <iframe
                      key={currentContent.htmlString}
                      srcDoc={currentContent.htmlString}
                      className="w-full h-full border border-border rounded-lg bg-white"
                      sandbox="allow-scripts"
                      title="MCP-UI Preview"
                    />
                  )}
                  {currentContent.type === 'externalUrl' && (
                    <iframe
                      key={currentContent.iframeUrl}
                      src={currentContent.iframeUrl}
                      className="w-full h-full border border-border rounded-lg bg-white"
                      sandbox="allow-scripts allow-same-origin"
                      title="External URL Preview"
                    />
                  )}
                  {currentContent.type === 'remoteDom' && (
                    <div className="flex items-center justify-center h-full border border-border rounded-lg bg-muted/20">
                      <div className="text-center text-muted-foreground p-8">
                        <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="font-semibold mb-2">Remote DOM Component</p>
                        <p className="text-sm">Framework: {currentContent.framework}</p>
                        <p className="text-xs mt-4">Preview requires @mcp-ui/client renderer</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Code Panel */}
              <div className="h-full flex flex-col">
                <div className="p-4 border-b bg-muted/50 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">createUIResource Options</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Edit options object (live preview updates)
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
                    code={generateEditorCode(currentContent)}
                    language="typescript"
                    onChange={handleContentChange}
                  />
                </div>
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
                  code={generateEditorCode(currentContent)}
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
