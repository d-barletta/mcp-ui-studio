'use client';

import { MCPUIComponent } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface LivePreviewProps {
  component: MCPUIComponent;
}

export function LivePreview({ component }: LivePreviewProps) {
  const renderComponent = (comp: MCPUIComponent, depth: number = 0): React.ReactNode => {
    const { type, props = {}, children } = comp;

    // Type guard for accessing props safely
    const getStringProp = (key: string, defaultValue = ''): string => {
      const value = props[key];
      return typeof value === 'string' ? value : defaultValue;
    };
    const getBooleanProp = (key: string): boolean => {
      const value = props[key];
      return typeof value === 'boolean' ? value : false;
    };
    const getNumberProp = (key: string, defaultValue = 0): number => {
      const value = props[key];
      return typeof value === 'number' ? value : defaultValue;
    };

    // Render different component types
    switch (type) {
      case 'form':
        return (
          <Card key={`${type}-${depth}`} className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>{getStringProp('title', 'Form')}</CardTitle>
              {getStringProp('description') && <CardDescription>{getStringProp('description')}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.isArray(children) && children.map((child, i) => (
                <div key={i}>{renderComponent(child, depth + 1)}</div>
              ))}
            </CardContent>
          </Card>
        );

      case 'input':
        return (
          <div key={`${type}-${depth}`} className="space-y-2">
            {getStringProp('label') && <Label>{getStringProp('label')}</Label>}
            <Input
              type={getStringProp('type', 'text')}
              placeholder={getStringProp('placeholder')}
              required={getBooleanProp('required')}
              defaultValue={getStringProp('value')}
            />
          </div>
        );

      case 'textarea':
        return (
          <div key={`${type}-${depth}`} className="space-y-2">
            {getStringProp('label') && <Label>{getStringProp('label')}</Label>}
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={getStringProp('placeholder')}
              rows={getNumberProp('rows', 3)}
            />
          </div>
        );

      case 'button':
        return (
          <Button key={`${type}-${depth}`} variant={getStringProp('variant') === 'primary' ? 'default' : 'outline'}>
            {getStringProp('text', 'Button')}
          </Button>
        );

      case 'container':
        return (
          <div key={`${type}-${depth}`} className="space-y-6">
            {getStringProp('title') && <h2 className="text-2xl font-bold">{getStringProp('title')}</h2>}
            {Array.isArray(children) && children.map((child, i) => (
              <div key={i}>{renderComponent(child, depth + 1)}</div>
            ))}
          </div>
        );

      case 'stats-grid':
        return (
          <div key={`${type}-${depth}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.isArray(children) && children.map((child, i) => (
              <div key={i}>{renderComponent(child, depth + 1)}</div>
            ))}
          </div>
        );

      case 'stat-card':
        return (
          <Card key={`${type}-${depth}`}>
            <CardHeader className="pb-2">
              <CardDescription>{getStringProp('title')}</CardDescription>
              <CardTitle className="text-3xl">{getStringProp('value')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-sm ${getStringProp('trend') === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {getStringProp('change')}
              </p>
            </CardContent>
          </Card>
        );

      case 'grid':
        return (
          <div
            key={`${type}-${depth}`}
            className={`grid gap-4 ${getNumberProp('columns') === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}
          >
            {Array.isArray(children) && children.map((child, i) => (
              <div key={i}>{renderComponent(child, depth + 1)}</div>
            ))}
          </div>
        );

      case 'card':
        return (
          <Card key={`${type}-${depth}`}>
            <CardHeader>
              <CardTitle>{getStringProp('title')}</CardTitle>
              <CardDescription>{getStringProp('description')}</CardDescription>
            </CardHeader>
            {(Array.isArray(children) && children.length > 0) && (
              <CardContent>
                {children.map((child, i) => (
                  <div key={i}>{renderComponent(child, depth + 1)}</div>
                ))}
              </CardContent>
            )}
          </Card>
        );

      case 'section':
        return (
          <div key={`${type}-${depth}`} className="space-y-4 border-b pb-6">
            {getStringProp('title') && <h3 className="text-lg font-semibold">{getStringProp('title')}</h3>}
            {Array.isArray(children) && children.map((child, i) => (
              <div key={i}>{renderComponent(child, depth + 1)}</div>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div key={`${type}-${depth}`} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`checkbox-${depth}`}
              defaultChecked={getBooleanProp('checked')}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor={`checkbox-${depth}`}>{getStringProp('label')}</Label>
          </div>
        );

      case 'text':
        return (
          <p key={`${type}-${depth}`} className="text-sm text-muted-foreground">
            {getStringProp('content')}
          </p>
        );

      case 'wizard':
      case 'table':
      case 'chart':
      case 'notification':
        return (
          <Card key={`${type}-${depth}`} className="p-6">
            <p className="text-sm text-muted-foreground">
              Preview for &quot;{type}&quot; component (implementation in progress)
            </p>
          </Card>
        );

      default:
        return (
          <div key={`${type}-${depth}`} className="p-4 border rounded bg-muted/50">
            <p className="text-xs text-muted-foreground">
              Component type: {type}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full bg-background p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {renderComponent(component)}
      </div>
    </div>
  );
}
