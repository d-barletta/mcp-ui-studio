# MCP UI Studio - AI Coding Agent Instructions

## Project Overview
**MCP UI Studio** is a Next.js 14 visual development environment for building MCP-UI (Model Context Protocol UI) interactive interfaces. The app enables developers to browse templates, preview them in sandboxed iframes, and export ready-to-use handler code in TypeScript, Python, or Ruby.

## Architecture

### Core Flow
1. **Template Selection** ([page.tsx](../app/page.tsx)): User browses pre-built templates in gallery view
2. **Studio Mode** ([page.tsx](../app/page.tsx)): Split-pane interface with tabs for Preview/Code/Export
3. **Live Preview**: Templates render as sandboxed HTML iframes or component trees
4. **Export**: Generate MCP server handler code in 3 languages via [lib/export.ts](../lib/export.ts)

### Key Architectural Patterns

**Template System** ([lib/templates.ts](../lib/templates.ts)):
- Templates define UI via `ContentType` union: `rawHtml`, `externalUrl`, or `remoteDom`
- Each template has metadata (name, category, description) + content + preview code
- Preview uses raw HTML in sandboxed iframes (NOT React components)

**Type-Safe Content Types** ([lib/types.ts](../lib/types.ts)):
```typescript
type ContentType = 
  | { type: 'rawHtml'; htmlString: string }
  | { type: 'externalUrl'; iframeUrl: string }
  | { type: 'remoteDom'; script: string; framework: 'react' | 'webcomponents' }
```

**Multi-Language Export** ([lib/export.ts](../lib/export.ts)):
- Unified `generateExport()` function for TypeScript/Python/Ruby
- Creates `UIResource` objects matching MCP protocol spec
- Supports both text and blob encoding

## Developer Workflows

### Running the App
```bash
npm run dev      # Development server on http://localhost:3000
npm run build    # Production build
npm start        # Serve production build
npm run lint     # ESLint checks
```

### Adding New Templates
1. Add template definition to [lib/templates.ts](../lib/templates.ts) `templates` array
2. Use `rawHtml` content type with complete HTML document (includes `<style>` and `<script>`)
3. Include `previewCode` (simplified code snippet for display)
4. Category options: Forms, Dashboards, Wizards, Tables, Settings, Cards

**Template HTML Pattern**:
```html
<!DOCTYPE html>
<html>
<head>
  <style>/* Inline CSS */</style>
</head>
<body>
  <!-- UI content -->
  <script>
    // Use window.parent.postMessage to send tool calls
    window.parent.postMessage({
      type: 'tool',
      payload: { toolName: 'myTool', params: {...} }
    }, '*');
  </script>
</body>
</html>
```

### Component Architecture
- **Client Components Only**: All interactive components use `'use client'` directive
- **Dynamic Imports**: Monaco Editor loaded dynamically to avoid SSR issues ([code-editor.tsx](../components/code-editor.tsx))
- **shadcn/ui**: UI primitives in `components/ui/` (Button, Card, Dialog, Tabs, etc.)
- **Theme Support**: Uses `next-themes` with ThemeProvider wrapper

## Project-Specific Conventions

### Import Paths
- Use `@/` alias for root imports (configured in [tsconfig.json](../tsconfig.json))
- Example: `import { Template } from '@/lib/types'`

### Component Props Pattern
```typescript
interface ComponentProps {
  prop: Type;
}

export function Component({ prop }: ComponentProps) {
  // Implementation
}
```

### State Management
- **Local State**: React `useState` for component-level state
- **Zustand Ready**: Installed but not yet implemented (future feature)

### Styling Conventions
- Tailwind utility classes with `cn()` helper from [lib/utils.ts](../lib/utils.ts)
- CSS custom properties for theming (see [tailwind.config.ts](../tailwind.config.ts))
- Dark mode via `class` strategy with `next-themes`

## Critical Files

- **[lib/types.ts](../lib/types.ts)**: Central type definitions for MCP-UI protocol
- **[lib/templates.ts](../lib/templates.ts)**: Template data source (currently ~180 lines)
- **[lib/export.ts](../lib/export.ts)**: Code generation for 3 target languages
- **[app/page.tsx](../app/page.tsx)**: Main app logic with gallery/studio view switching
- **[components/code-editor.tsx](../components/code-editor.tsx)**: Monaco editor wrapper (dynamic import required)
- **[components/live-preview.tsx](../components/live-preview.tsx)**: Component renderer (legacy, mostly unused)

## Key Implementation Details

### Monaco Editor Integration
- Must use `dynamic()` with `ssr: false` to prevent server-side rendering errors
- Theme is hardcoded to `vs-dark`
- Editor options: no minimap, 14px font, auto layout enabled

### Iframe Preview
- Templates with `rawHtml` render in sandboxed iframe with `srcDoc` attribute
- Sandbox allows scripts: `sandbox="allow-scripts"`
- External URLs use `iframeUrl` in separate content type

### Export Code Generation
- Templates contain raw HTML, but exports wrap them in MCP protocol format
- `createUIResource()` creates proper MCP `UIResource` objects
- Encoding options: `text` (default) or `blob` (base64)

## Debugging Tips
- Check browser console for iframe errors (they don't bubble up)
- Monaco editor issues often SSR-related—verify dynamic import
- Template not showing? Verify `ContentType` discriminated union matches exactly
