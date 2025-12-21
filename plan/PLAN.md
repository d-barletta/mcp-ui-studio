# MCP UI Studio - Complete Project Initialization Prompt

## Project Overview

Create **MCP UI Studio**, the professional visual development environment for building MCP-UI interactive interfaces. This tool bridges traditional UI component libraries (Shadcn, Material UI, Tailwind) and MCP-UI server implementations, enabling developers to design, test, preview, and export production-ready MCP-UI handlers through an intuitive visual interface.

## Core Value Proposition

**"The Visual Workshop for MCP-UI Development"**

Transform any UI component into production MCP-UI code in seconds. Visual interface builder + template library + framework converter + live preview + multi-language export.

---

## Tech Stack

### Frontend

- **Framework**: Next.js 14 (App Router) + TypeScript 5.x
- **Styling**: Tailwind CSS 3.x + shadcn/ui
- **State**: Zustand 4.x
- **Editor**: Monaco Editor (VS Code engine)
- **Preview**: Sandboxed iframe with @mcp-ui/client
- **Icons**: Lucide React
- **Animations**: Framer Motion

### Key Dependencies

```bash
npm install next react react-dom typescript tailwindcss
npm install @mcp-ui/client zustand @monaco-editor/react
npm install lucide-react framer-motion clsx tailwind-merge
npm install -D prettier eslint-config-prettier
```

---

## Project Structure

```
mcp-ui-studio/
├── app/
│   ├── page.tsx                      # Landing page
│   ├── studio/page.tsx               # Main studio app
│   ├── templates/page.tsx            # Template gallery
│   ├── docs/page.tsx                 # Documentation
│   └── api/
│       ├── export/route.ts           # Export handler
│       └── transform/route.ts        # Component transformation
│
├── components/
│   ├── ui/                           # shadcn/ui components
│   ├── studio/                       # Core studio features
│   │   ├── TemplateGallery.tsx      # Template browser
│   │   ├── CodeEditor.tsx            # Monaco wrapper
│   │   ├── LivePreview.tsx           # Iframe preview
│   │   ├── ComponentBuilder.tsx      # Drag-drop builder
│   │   ├── FrameworkBridge.tsx       # Component converter
│   │   └── ExportModal.tsx           # Multi-language export
│   ├── layout/                       # Header, Sidebar, Footer
│   └── marketing/                    # Landing page components
│
├── lib/
│   ├── templates/                    # Pre-built templates
│   │   ├── forms/                   # Login, feedback, file upload
│   │   ├── dashboards/              # Stats, tables, charts
│   │   ├── wizards/                 # Multi-step flows
│   │   └── interactive/             # Ratings, polls, quizzes
│   ├── transformers/                 # Framework converters
│   │   ├── shadcn-to-mcp.ts
│   │   ├── html-to-mcp.ts
│   │   └── react-to-mcp.ts
│   ├── generators/                   # Code generators
│   │   ├── typescript-generator.ts
│   │   ├── python-generator.ts
│   │   └── ruby-generator.ts
│   ├── store/                        # Zustand stores
│   ├── types/                        # TypeScript types
│   └── utils/                        # Utilities
│
├── public/
│   └── templates/                    # Template assets
└── docs/                             # Documentation
```

---

## Implementation Roadmap (8 Weeks)

### 🎯 Phase 1: Foundation (Week 1-2)

**Goal**: Working template gallery with live preview

#### Core Tasks:

1. **Project Setup**

   ```bash
   npx create-next-app@latest mcp-ui-studio --typescript --tailwind --app
   cd mcp-ui-studio
   npm install zustand @monaco-editor/react lucide-react framer-motion
   npx shadcn-ui@latest init
   npx shadcn-ui@latest add button card tabs dialog select
   ```

2. **Template System**
   - Define Template interface with metadata
   - Create 10 initial templates (2 per category)
   - Categories: Forms, Dashboards, Wizards, Interactive, Data Display
   - Each template includes: HTML preview, MCP handler code, metadata

3. **Template Gallery UI**
   - Grid layout with category filters
   - Search functionality
   - Template cards with hover effects
   - Featured/New badges

4. **Live Preview Component**
   - Sandboxed iframe with CSP
   - Real-time HTML rendering
   - Theme toggle (light/dark)
   - Responsive width controls

**Deliverable**: Browse templates, filter by category, see live previews

---

### 🚀 Phase 2: Code Editor & Export (Week 3-4)

**Goal**: View and export MCP-UI code in multiple languages

#### Core Tasks:

1. **Monaco Editor Integration**
   - Setup with TypeScript/Python/Ruby syntax
   - Custom MCP-UI syntax highlighting
   - Auto-formatting with Prettier
   - Error detection

2. **Code Generators**
   - TypeScript generator (primary)
   - Python generator (secondary)
   - Ruby generator (tertiary)
   - Include imports, type definitions, documentation

3. **Export Modal**
   - Language selector tabs
   - Code preview with syntax highlighting
   - Copy to clipboard
   - Download as file
   - Include package.json/requirements.txt snippets

4. **Template Metadata**
   - Usage documentation
   - Integration guides
   - Field descriptions
   - Validation examples

**Deliverable**: Export templates to TypeScript/Python/Ruby with one click

---

### 🎨 Phase 3: Framework Bridge (Week 5-6)

**Goal**: Convert existing components to MCP-UI

#### Core Tasks:

1. **Component Parsers**
   - Shadcn/ui parser: Extract JSX elements, props, structure
   - HTML/Tailwind parser: Parse DOM, extract classes
   - React parser: Handle controlled components, state

2. **Transformation Logic**
   - Map component types to MCP-UI field types
   - Extract validation rules
   - Generate MCP-UI handler structure
   - Preserve styling hints

3. **Bridge UI**
   - Split view: Input (paste component) | Output (MCP-UI code)
   - Framework selector dropdown
   - Convert button with loading state
   - Side-by-side preview comparison
   - Field mapping editor

4. **Validation & Testing**
   - Parse error handling
   - Edge case coverage
   - Real-world component testing

**Deliverable**: Paste Shadcn/HTML/React components, get MCP-UI code

---

### 🎯 Phase 4: Visual Builder (Week 7-8)

**Goal**: No-code drag-and-drop interface builder

#### Core Tasks:

1. **Drag-Drop System**
   - Field palette with draggable types
   - Drop zone canvas
   - Reorder fields by dragging
   - Visual field preview cards

2. **Field Types**
   - Text, email, password, textarea
   - Select, checkbox, radio
   - File upload, date picker
   - Rating widget, custom HTML

3. **Properties Panel**
   - Field configuration (label, placeholder, validation)
   - Styling options (Tailwind classes)
   - Conditional logic
   - Required/optional toggle

4. **Code Generation**
   - Real-time MCP-UI handler generation
   - Export builder state
   - Import/restore projects
   - Save as template

5. **Polish & Launch**
   - Performance optimization
   - Accessibility audit (WCAG 2.1 AA)
   - Cross-browser testing
   - Documentation
   - Demo video

**Deliverable**: Full visual builder with no-code form creation

---

## Core Type Definitions

```typescript
// lib/types/template.ts
export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'forms' | 'dashboards' | 'wizards' | 'interactive' | 'data-display';
  preview: string; // Preview emoji/icon
  thumbnail: string; // Screenshot URL
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  html: string; // HTML preview code
  mcpHandler: string; // MCP-UI handler code
  metadata: {
    fields: Field[];
    actions: Action[];
    version: string;
    author: string;
    lastUpdated: string;
  };
}

export interface Field {
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'file'
    | 'date'
    | 'rating';
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: ValidationRule[];
}

export interface Action {
  type: 'submit' | 'cancel' | 'next' | 'previous';
  label: string;
  primary?: boolean;
}

export interface ExportBundle {
  handler: string; // Generated code
  packageJson?: object; // Package dependencies
  readme?: string; // Usage documentation
}
```

---

## State Management (Zustand)

```typescript
// lib/store/studio-store.ts
interface StudioState {
  // Active template
  activeTemplate: Template | null;
  setActiveTemplate: (template: Template | null) => void;

  // Editor preferences
  editorLanguage: 'typescript' | 'python' | 'ruby';
  setEditorLanguage: (lang: string) => void;

  // Preview settings
  previewWidth: number;
  previewTheme: 'light' | 'dark';

  // Builder state
  builderFields: Field[];
  addField: (field: Field) => void;
  updateField: (id: string, updates: Partial<Field>) => void;
  removeField: (id: string) => void;

  // User data
  recentTemplates: string[];
  favoriteTemplates: string[];
  toggleFavorite: (id: string) => void;
}
```

---

## Design System

### Brand Colors

```css
:root {
  --brand-primary: #3b82f6; /* Blue */
  --brand-secondary: #8b5cf6; /* Purple */
  --brand-accent: #ec4899; /* Pink */

  --success: #10b981;
  --error: #ef4444;
  --warning: #f59e0b;
}
```

### Typography

- **Sans**: Inter (UI text)
- **Mono**: JetBrains Mono (code)
- **Headings**: 42px/32px/24px (xl/lg/md)
- **Body**: 16px/14px (base/sm)

### Spacing

- Use 8px grid system
- Border radius: 8px/12px/16px
- Shadows: subtle elevation
- Transitions: 150ms ease

---

## User Flows

### Flow 1: Template Quick Start (< 60 seconds)

```
1. Land on homepage → Click "Start Building"
2. Browse templates → Select "Login Form"
3. See live preview + code
4. Click "Copy Code" → Success!
5. Paste in MCP server → Working!
```

### Flow 2: Component Conversion (< 3 minutes)

```
1. Have existing Shadcn form
2. Go to "Framework Bridge"
3. Paste component code → Auto-detect
4. Click "Convert to MCP-UI"
5. Review generated code
6. Export to TypeScript
7. Integrate in codebase
```

### Flow 3: Visual Builder (< 10 minutes)

```
1. Open "Component Builder"
2. Drag fields from palette
3. Configure properties
4. Preview in real-time
5. Generate MCP-UI code
6. Export handler
```

---

## Feature Priority Matrix

### Must Have (MVP - Week 8)

- ✅ 15+ production-ready templates
- ✅ Live preview with theme toggle
- ✅ Export to TypeScript/Python/Ruby
- ✅ Shadcn component conversion
- ✅ Mobile responsive UI
- ✅ Copy to clipboard
- ✅ Template search & filters

### Should Have (Post-MVP)

- 🔄 Visual drag-drop builder
- 🔄 User accounts & saved projects
- 🔄 Template marketplace
- 🔄 AI-powered generation
- 🔄 VS Code extension
- 🔄 CLI tool

### Nice to Have (Future)

- 💡 Real-time collaboration
- 💡 Component analytics
- 💡 A/B testing tools
- 💡 Integration with Figma
- 💡 Custom plugin system

---

## Success Metrics

### Launch Targets (Week 8)

- **Performance**: < 3s preview load time
- **Templates**: 15+ ready-to-use
- **Export formats**: 3 languages
- **Accessibility**: WCAG 2.1 AA compliant
- **Browser support**: Chrome/Firefox/Safari latest 2 versions
- **Mobile**: Fully responsive 375px+

### Growth Metrics (3 months)

- **Users**: 1,000+ unique visitors
- **Exports**: 500+ code exports
- **Templates**: 30+ in library
- **Community**: 50+ GitHub stars
- **Conversions**: 5+ saved projects per user

---

## Getting Started

### Initialization Commands

```bash
# Create project
npx create-next-app@latest mcp-ui-studio --typescript --tailwind --app
cd mcp-ui-studio

# Install dependencies
npm install zustand @monaco-editor/react lucide-react framer-motion
npm install clsx tailwind-merge date-fns
npm install -D prettier eslint-config-prettier

# Setup shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card tabs dialog select textarea badge tooltip

# Run dev server
npm run dev
```

### First Steps

1. Setup folder structure as outlined
2. Create base layout components
3. Build template data structure (10 templates)
4. Implement TemplateGallery component
5. Setup LivePreview with iframe
6. Integrate Monaco Editor
7. Build export functionality
8. Add Framework Bridge
9. Polish UI/UX
10. Write documentation

---

## Technical Considerations

### Security

- Sanitize all user input
- Sandbox iframe with strict CSP: `sandbox="allow-scripts"`
- No eval() or Function() usage
- Rate limit API endpoints
- Validate generated code before export

### Performance

- Lazy load Monaco Editor (dynamic import)
- Virtual scrolling for template gallery
- Debounce preview updates (300ms)
- Code splitting per route
- Optimize images (WebP, lazy loading)
- Cache templates in localStorage

### Accessibility

- Keyboard navigation (Tab, Enter, Escape)
- ARIA labels on all interactive elements
- Focus management in modals
- Screen reader announcements
- Color contrast ratios ≥ 4.5:1
- Skip links for main content

### Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile: iOS Safari 14+, Chrome Android 90+

---

## Documentation Structure

```
docs/
├── README.md                    # Overview
├── getting-started.md          # Quick start
├── templates/
│   ├── overview.md            # Template system
│   └── creating.md            # Add templates
├── framework-bridge/
│   ├── shadcn.md             # Shadcn conversion
│   └── html.md               # HTML conversion
├── visual-builder.md          # Builder guide
├── export.md                  # Export formats
└── deployment.md              # Deploy guide
```

---

## Site Configuration

```typescript
// config/site.ts
export const siteConfig = {
  name: 'MCP UI Studio',
  tagline: 'The Visual Workshop for MCP-UI Development',
  description:
    'Build, preview, and export MCP-UI interfaces visually. Transform any component into production-ready MCP handlers in seconds.',
  url: 'https://mcpuistudio.com',
  links: {
    github: 'https://github.com/yourusername/mcp-ui-studio',
    docs: 'https://mcpuistudio.com/docs',
    twitter: 'https://twitter.com/mcpuistudio',
  },
};
```

---

## Sample Templates to Create

### Forms (5 templates)

1. **Login Form** - Email + password with remember me
2. **Feedback Widget** - Star rating + comments
3. **File Upload** - Drag-drop with progress
4. **Contact Form** - Name, email, message
5. **Survey Form** - Multiple choice + text

### Dashboards (3 templates)

1. **Stats Cards** - KPI metrics with trends
2. **Data Table** - Sortable, filterable table
3. **Analytics Panel** - Charts + graphs

### Wizards (3 templates)

1. **Onboarding** - 3-step user setup
2. **Checkout Flow** - Cart → Shipping → Payment
3. **Setup Wizard** - Configuration steps

### Interactive (4 templates)

1. **Rating Widget** - 5-star with feedback
2. **Poll Creator** - Multiple choice voting
3. **Quiz Builder** - Questions with answers
4. **Comment System** - Nested replies

---

## Implementation Priority

### Week 1-2 Focus

- Project setup + structure
- Template data (10 templates)
- Gallery UI with filters
- Live preview iframe

### Week 3-4 Focus

- Monaco Editor integration
- TypeScript generator
- Python/Ruby generators
- Export modal UI

### Week 5-6 Focus

- Shadcn parser
- HTML parser
- Framework Bridge UI
- Conversion testing

### Week 7-8 Focus

- Visual builder foundation
- Drag-drop system
- Properties panel
- Final polish + docs

---

## Launch Checklist

### Pre-Launch

- [ ] All 15 templates complete and tested
- [ ] Export working for all 3 languages
- [ ] Framework Bridge handles edge cases
- [ ] Performance < 3s load time
- [ ] Mobile responsive tested
- [ ] Accessibility audit passed
- [ ] Documentation complete
- [ ] Demo video recorded
- [ ] SEO meta tags added
- [ ] Analytics integrated

### Launch Day

- [ ] Deploy to Vercel
- [ ] Post on Product Hunt
- [ ] Share on Twitter/LinkedIn
- [ ] Post in MCP Discord/Slack
- [ ] Update GitHub README
- [ ] Submit to directories

### Post-Launch (Week 9+)

- [ ] Gather user feedback
- [ ] Fix critical bugs
- [ ] Add most-requested features
- [ ] Expand template library
- [ ] Build community

---

## License & Attribution

- **License**: MIT License
- **Credit**: Built for the MCP-UI ecosystem
- **Open Source**: Contributions welcome
- **Community**: Discord server for support

---

**This prompt contains everything needed to build MCP UI Studio from scratch. Follow the 8-week roadmap, start with Phase 1, and iterate. The vision is clear, the plan is detailed, execution is all that remains. Let's build! 🚀**
