'use client';

import { useState } from 'react';
import { Template } from '@/lib/types';
import { TemplateGallery } from '@/components/template-gallery';
import { LivePreview } from '@/components/live-preview';
import { ExportPanel } from '@/components/export-panel';
import { CodeEditor } from '@/components/code-editor';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Code, Eye, Download } from 'lucide-react';
import { ThemeSwitcher } from '@/components/theme-switcher';

export default function StudioPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [view, setView] = useState<'gallery' | 'studio'>('gallery');

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setView('studio');
  };

  const handleBackToGallery = () => {
    setView('gallery');
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

  if (!selectedTemplate) {
    return null;
  }

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
                Live Preview
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
                  {selectedTemplate.content.type === 'rawHtml' && (
                    <iframe
                      srcDoc={selectedTemplate.content.htmlString}
                      className="w-full h-full border border-border rounded-lg bg-white"
                      sandbox="allow-scripts"
                      title="MCP-UI Preview"
                    />
                  )}
                  {selectedTemplate.content.type === 'externalUrl' && (
                    <iframe
                      src={selectedTemplate.content.iframeUrl}
                      className="w-full h-full border border-border rounded-lg bg-white"
                      sandbox="allow-scripts allow-same-origin"
                      title="External URL Preview"
                    />
                  )}
                  {selectedTemplate.content.type === 'remoteDom' && (
                    <div className="flex items-center justify-center h-full border border-border rounded-lg bg-muted/20">
                      <div className="text-center text-muted-foreground p-8">
                        <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="font-semibold mb-2">Remote DOM Component</p>
                        <p className="text-sm">Framework: {selectedTemplate.content.framework}</p>
                        <p className="text-xs mt-4">Preview requires @mcp-ui/client renderer</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Content JSON Panel */}
              <div className="h-full flex flex-col">
                <div className="p-4 border-b bg-muted/50">
                  <h3 className="font-semibold">MCP-UI Content</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Content definition for createUIResource
                  </p>
                </div>
                <div className="flex-1 min-h-0">
                  <CodeEditor
                    code={JSON.stringify(selectedTemplate.content, null, 2)}
                    language="typescript"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="code" className="flex-1 m-0">
            <div className="h-full flex flex-col">
              <div className="p-4 border-b bg-muted/50">
                <h3 className="font-semibold">Preview Code</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  HTML preview of the component
                </p>
              </div>
              <div className="flex-1 min-h-0">
                <CodeEditor
                  code={selectedTemplate.previewCode}
                  language="typescript"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="export" className="flex-1 m-0 p-0">
            <ScrollArea className="h-full">
              <div className="p-8 max-w-4xl mx-auto">
                <ExportPanel content={selectedTemplate.content} />
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
