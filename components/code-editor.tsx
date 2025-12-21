'use client';

import dynamic from 'next/dynamic';
import { ExportLanguage } from '@/lib/types';
import { useEffect, useState } from 'react';

// Dynamically import Monaco to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-muted">
      <p className="text-muted-foreground">Loading editor...</p>
    </div>
  ),
});

interface CodeEditorProps {
  code: string;
  language: ExportLanguage;
  onChange?: (value: string | undefined) => void;
  readOnly?: boolean;
}

export function CodeEditor({ code, language, onChange, readOnly = false }: CodeEditorProps) {
  const [fontSize, setFontSize] = useState(12);

  useEffect(() => {
    const handleResize = () => {
      setFontSize(window.innerWidth < 768 ? 10 : 12);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getLanguageMode = (lang: ExportLanguage): string => {
    switch (lang) {
      case 'typescript':
        return 'typescript';
      case 'python':
        return 'python';
      case 'ruby':
        return 'ruby';
      default:
        return 'typescript';
    }
  };

  const handleEditorWillMount = (monaco: any) => {
    // Completely disable all TypeScript/JavaScript diagnostics
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
      noSuggestionDiagnostics: true,
    });

    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
      noSuggestionDiagnostics: true,
    });

    // Disable all compiler options that might trigger diagnostics
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      allowNonTsExtensions: true,
      noUnusedLocals: false,
      noUnusedParameters: false,
    });
  };

  return (
    <MonacoEditor
      height="100%"
      language={getLanguageMode(language)}
      value={code}
      onChange={onChange}
      theme="vs-dark"
      beforeMount={handleEditorWillMount}
      options={{
        readOnly,
        minimap: { enabled: false },
        fontSize,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
      }}
    />
  );
}
