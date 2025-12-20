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
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">MCP UI Studio</h1>
            <p className="text-lg text-muted-foreground">
              Professional visual development environment for MCP-UI interfaces
            </p>
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
          <span className="text-sm text-muted-foreground">MCP UI Studio</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="preview" className="h-full flex flex-col">
          <div className="border-b px-4">
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
                <ScrollArea className="h-full">
                  <LivePreview component={selectedTemplate.mcpui} />
                </ScrollArea>
              </div>

              {/* Component JSON Panel */}
              <div className="h-full overflow-hidden">
                <div className="p-4 border-b bg-muted/50">
                  <h3 className="font-semibold">MCP-UI Structure</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Component definition in JSON format
                  </p>
                </div>
                <div className="h-[calc(100%-73px)]">
                  <CodeEditor
                    code={JSON.stringify(selectedTemplate.mcpui, null, 2)}
                    language="typescript"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="code" className="flex-1 m-0">
            <div className="h-full">
              <div className="p-4 border-b bg-muted/50">
                <h3 className="font-semibold">Edit Component</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Modify the MCP-UI component structure (preview only)
                </p>
              </div>
              <div className="h-[calc(100%-73px)]">
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
                <ExportPanel component={selectedTemplate.mcpui} />
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
