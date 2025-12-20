# VS Code Configuration for MCP UI Studio

This directory contains VS Code workspace configurations for quick full-stack development.

## Quick Start

### Option 1: Using Debug Panel (Recommended)
1. Press `F5` or click "Run and Debug" in VS Code
2. Select **"MCP UI Studio: Full Stack"** from the dropdown
3. This will:
   - Start the Next.js dev server
   - Open Chrome with debugging enabled
   - Auto-attach to both server and client processes

### Option 2: Using Run Menu
1. Go to `Run > Start Debugging` (F5)
2. Choose your configuration:
   - **Next.js: debug server-side** - Debug Next.js server only
   - **Next.js: debug client-side** - Debug React in Chrome
   - **Next.js: debug full stack** - Debug both server and client
   - **MCP UI Studio: Full Stack** - Compound config (runs both)

### Option 3: Manual Start
```bash
npm run dev
```
Then navigate to http://localhost:3000

## Configurations

### 1. Next.js: debug server-side
- Starts dev server in debug mode
- Automatically opens browser when ready
- Debugs server-side code (API routes, SSR)

### 2. Next.js: debug client-side
- Attaches Chrome debugger to running app
- Debugs React components and client code
- Requires dev server already running

### 3. Next.js: debug full stack
- Single configuration for both server and client
- Starts dev server with integrated terminal
- Opens Chrome with debugging on server ready

### 4. MCP UI Studio: Full Stack (Compound)
- Runs both server-side and client-side debuggers
- Best for full-stack debugging
- Stops all processes together

## Debugging Tips

### Breakpoints
- Add breakpoints by clicking left of line numbers
- Red dot = active breakpoint
- Works in .tsx, .ts files

### Watch Expressions
- Add variables to Watch panel
- Monitor state changes in real-time

### Debug Console
- Execute code in current context
- Inspect variables
- Run expressions

## Recommended Extensions

The `.vscode/extensions.json` file includes:

1. **ESLint** - JavaScript/TypeScript linting
2. **Tailwind CSS IntelliSense** - Tailwind class autocomplete
3. **Prettier** - Code formatting
4. **TypeScript and JavaScript Next** - Enhanced TS support
5. **ES7 React Snippets** - React code snippets
6. **Auto Rename Tag** - Sync HTML/JSX tag pairs
7. **Error Lens** - Inline error highlighting

VS Code will prompt you to install these on first open.

## Settings

The `.vscode/settings.json` configures:

- **Format on Save** - Auto-format with Prettier
- **ESLint Auto-fix** - Fix linting issues on save
- **Tailwind IntelliSense** - Smart class suggestions
- **TypeScript** - Workspace TypeScript version

## Keyboard Shortcuts

- `F5` - Start debugging
- `Shift+F5` - Stop debugging
- `Ctrl+Shift+F5` - Restart debugging
- `F9` - Toggle breakpoint
- `F10` - Step over
- `F11` - Step into
- `Shift+F11` - Step out

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Debugger Not Attaching
1. Ensure Chrome is installed
2. Check no other instance using port 3000
3. Restart VS Code

### TypeScript Errors in IDE
1. Open Command Palette (`Ctrl+Shift+P`)
2. Run "TypeScript: Restart TS Server"

## Additional Resources

- [Next.js Debugging Docs](https://nextjs.org/docs/pages/building-your-application/configuring/debugging)
- [VS Code Debugging Guide](https://code.visualstudio.com/docs/editor/debugging)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
