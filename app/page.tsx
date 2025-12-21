'use client';

import { useRouter } from 'next/navigation';
import { Template } from '@/lib/types';
import { TemplateGallery } from '@/components/template-gallery';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Logo } from '@/components/logo';
import { Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GalleryPage() {
  const router = useRouter();

  const handleSelectTemplate = (template: Template) => {
    router.push(`/${template.id}`);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <Logo className="h-10 w-10" />
              <h1 className="text-4xl font-bold">MCP UI Studio</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Visual development environment for MCP-UI interfaces
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://github.com/d-barletta/mcp-ui-studio"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View on GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </Button>
            <ThemeSwitcher />
          </div>
        </div>
        <TemplateGallery onSelectTemplate={handleSelectTemplate} />
      </div>
    </main>
  );
}
