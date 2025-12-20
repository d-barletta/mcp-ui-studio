'use client';

import { useRouter } from 'next/navigation';
import { Template } from '@/lib/types';
import { TemplateGallery } from '@/components/template-gallery';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Logo } from '@/components/logo';

export default function GalleryPage() {
  const router = useRouter();

  const handleSelectTemplate = (template: Template) => {
    router.push(`/${template.id}`);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Logo className="h-10 w-10" />
              <h1 className="text-4xl font-bold">MCP UI Studio</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Visual development environment for MCP-UI interfaces
            </p>
          </div>
          <ThemeSwitcher />
        </div>
        <TemplateGallery onSelectTemplate={handleSelectTemplate} />
      </div>
    </main>
  );
}

