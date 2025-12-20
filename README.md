# MCP UI Studio

**Professional visual development environment for MCP-UI interfaces**

Build production-ready MCP-UI handlers visually, test interactively, and export instantly.

![MCP UI Studio](https://github.com/user-attachments/assets/24ba4c3d-30cd-47cb-8012-f9f617b2184d)

## Features

### 🎨 Template Gallery
Browse and select from **8+ pre-built component templates** including:
- **Forms**: Contact forms, login forms
- **Dashboards**: Analytics dashboards with stats cards
- **Wizards**: Multi-step form wizards with progress indicators
- **Tables**: Interactive data tables with sorting and filtering
- **Settings**: User settings panels
- **Cards**: Card galleries with images and actions
- **Charts**: Analytics charts and metrics
- **Notifications**: Notification feeds

### 👁️ Live Sandboxed Preview
- Real-time component rendering
- Interactive testing environment
- Split-pane view with preview and code
- Responsive layout testing

### 💻 Monaco Editor Integration
- Professional code editing experience
- Syntax highlighting for TypeScript, Python, and Ruby
- Code structure visualization
- JSON schema validation

### 🚀 Multi-Language Export
Export your MCP-UI components in three languages:
- **TypeScript**: For Node.js and Deno MCP servers
- **Python**: For Python-based MCP servers
- **Ruby**: For Ruby-based MCP servers

### 🌉 Framework Bridge
Convert between different UI frameworks:
- Shadcn UI → MCP-UI conversion (coming soon)
- Component structure transformation
- Props mapping and translation

### 🎯 Visual Component Builder
- Component tree structure
- Property editor panel
- Component palette with MCP-UI widgets
- Drag-and-drop interface (coming soon)

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality UI components
- **Monaco Editor** - VS Code's editor
- **Lucide React** - Beautiful icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/d-barletta/mcp-ui-studio.git
cd mcp-ui-studio

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Building for Production

```bash
# Create an optimized production build
npm run build

# Start the production server
npm start
```

## Usage

### 1. Browse Templates
Start by exploring the template gallery on the home page. Click any template card to open it in the studio.

### 2. View Live Preview
See your component rendered in real-time with interactive controls. The preview updates instantly as you make changes.

### 3. Edit Component Structure
Switch to the Code Editor tab to modify the MCP-UI component structure using the integrated Monaco editor.

### 4. Export Code
Navigate to the Export tab to:
- Choose your target language (TypeScript, Python, or Ruby)
- Copy the generated code
- Download the handler file

### 5. Integrate with Your MCP Server
Take the exported code and integrate it directly into your MCP server implementation.

## Component Structure

MCP-UI components follow a simple JSON structure:

```json
{
  "type": "form",
  "props": {
    "title": "Contact Us",
    "description": "Get in touch"
  },
  "children": [
    {
      "type": "input",
      "props": {
        "label": "Name",
        "placeholder": "John Doe"
      }
    }
  ]
}
```

## Development

### Project Structure

```
mcp-ui-studio/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main studio page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── template-gallery.tsx
│   ├── live-preview.tsx
│   ├── code-editor.tsx
│   └── export-panel.tsx
├── lib/                   # Utilities and data
│   ├── types.ts          # TypeScript types
│   ├── templates.ts      # Template definitions
│   ├── export.ts         # Code generation
│   └── utils.ts          # Helper functions
└── public/               # Static assets
```

### Adding New Templates

1. Add your template definition to `lib/templates.ts`:

```typescript
{
  id: 'my-template',
  name: 'My Template',
  description: 'Description of template',
  category: 'Category',
  mcpui: {
    type: 'container',
    props: { /* props */ },
    children: [ /* children */ ]
  },
  previewCode: '/* JSON string */'
}
```

2. The template will automatically appear in the gallery.

### Extending the Live Preview

Add support for new component types in `components/live-preview.tsx` by adding a new case to the switch statement in the `renderComponent` function.

## Roadmap

- [ ] Real-time collaborative editing
- [ ] Component versioning and history
- [ ] Template marketplace
- [ ] Advanced drag-and-drop builder
- [ ] Component testing framework
- [ ] Integration with popular MCP servers
- [ ] Theme customization
- [ ] Import from existing code
- [ ] Component library management

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Editor powered by [Monaco Editor](https://microsoft.github.io/monaco-editor/)
