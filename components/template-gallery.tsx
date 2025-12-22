'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Template } from '@/lib/types';
import { templates } from '@/lib/templates';
import { Search, X } from 'lucide-react';

interface TemplateGalleryProps {
  onSelectTemplate: (template: Template) => void;
}

export function TemplateGallery({ onSelectTemplate }: TemplateGalleryProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter templates based on search query
  const filteredTemplates = useMemo(() => {
    if (!searchQuery.trim()) return templates;

    const query = searchQuery.toLowerCase();
    return templates.filter(
      (template) =>
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const categories = Array.from(new Set(filteredTemplates.map((t) => t.category)));

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
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Template Gallery</h2>
        <p className="mt-2 text-muted-foreground">
          Choose from pre-built MCP-UI components to get started
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search templates by name, description, or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="text-sm text-muted-foreground">
          Found {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}{' '}
          matching &quot;{searchQuery}&quot;
        </div>
      )}

      {/* No Results Message */}
      {filteredTemplates.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <Search className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-semibold">No templates found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your search terms or clear the search to see all templates
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Clear Search
          </button>
        </div>
      )}

      {categories.map((category) => (
        <div key={category} className="space-y-4">
          <h3 className="text-xl font-semibold">
            {category}{' '}
            <span className="text-sm font-normal text-muted-foreground">
              ({filteredTemplates.filter((t) => t.category === category).length})
            </span>
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates
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
