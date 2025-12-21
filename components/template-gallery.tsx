'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Template } from '@/lib/types';
import { templates } from '@/lib/templates';

interface TemplateGalleryProps {
  onSelectTemplate: (template: Template) => void;
}

export function TemplateGallery({ onSelectTemplate }: TemplateGalleryProps) {
  const categories = Array.from(new Set(templates.map((t) => t.category)));

  const getContentTypeBadge = (template: Template) => {
    const { type } = template.content;
    const badges = {
      rawHtml: { label: 'HTML', className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
      externalUrl: {
        label: 'External URL',
        className: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      },
      remoteDom: {
        label: 'Remote DOM',
        className: 'bg-green-500/10 text-green-500 border-green-500/20',
      },
    };

    const badge = badges[type];
    return (
      <span
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${badge.className}`}
      >
        {badge.label}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Template Gallery</h2>
        <p className="mt-2 text-muted-foreground">
          Choose from pre-built MCP-UI components to get started
        </p>
      </div>

      {categories.map((category) => (
        <div key={category} className="space-y-4">
          <h3 className="text-xl font-semibold">{category}</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates
              .filter((t) => t.category === category)
              .map((template) => (
                <Card
                  key={template.id}
                  className="cursor-pointer transition-colors hover:border-primary"
                  onClick={() => onSelectTemplate(template)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      {getContentTypeBadge(template)}
                    </div>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-32 overflow-auto rounded-md bg-muted p-4 font-mono text-xs">
                      {template.previewCode.substring(0, 100)}...
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
