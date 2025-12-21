'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeEditor } from './code-editor';
import { generateExport } from '@/lib/export';
import { ContentType, ExportLanguage } from '@/lib/types';
import { Download, Copy, Check } from 'lucide-react';

interface ExportPanelProps {
  content: ContentType;
}

export function ExportPanel({ content }: ExportPanelProps) {
  const [language, setLanguage] = useState<ExportLanguage>('typescript');
  const [copied, setCopied] = useState(false);

  const exportCode = generateExport(content, language, 'text');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(exportCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const extensions = {
      typescript: 'ts',
      python: 'py',
      ruby: 'rb',
    };
    const blob = new Blob([exportCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mcp-ui-handler.${extensions[language]}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="h-full border-0 md:border shadow-none md:shadow rounded-none md:rounded-xl">
      <CardHeader>
        <CardTitle>Export Code</CardTitle>
        <CardDescription>
          Export your MCP-UI component in TypeScript, Python, or Ruby
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={language} onValueChange={(v) => setLanguage(v as ExportLanguage)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="typescript">TypeScript</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
            <TabsTrigger value="ruby">Ruby</TabsTrigger>
          </TabsList>

          <TabsContent value="typescript" className="h-[400px] mt-4">
            <CodeEditor code={exportCode} language="typescript" readOnly />
          </TabsContent>

          <TabsContent value="python" className="h-[400px] mt-4">
            <CodeEditor code={exportCode} language="python" readOnly />
          </TabsContent>

          <TabsContent value="ruby" className="h-[400px] mt-4">
            <CodeEditor code={exportCode} language="ruby" readOnly />
          </TabsContent>
        </Tabs>

        <div className="flex gap-2">
          <Button onClick={handleCopy} variant="outline" className="flex-1">
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy Code
              </>
            )}
          </Button>
          <Button onClick={handleDownload} className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
