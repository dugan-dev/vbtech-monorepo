# Next.js 15 Template

This is a template application built with Next.js 15 and the App Router. It includes our standard configuration and can be used as a starting point for new applications.

## Features

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui components with custom theme
- Type-safe routing with Declarative Routes
- Type-safe environment variables with t3-env
- Automatic component imports
- Custom font configuration (Geist)

## Creating a New App

1. Copy the template:

```bash
cp -r apps/next-15-template apps/your-app-name
```

2. Update package information:

   - Change `name` in `package.json`
   - Update import paths if needed
   - Add app-specific dependencies

3. Update configuration files:
   - `next.config.ts`: Add app-specific Next.js configuration
   - `env/server.ts` and `env/client.ts`: Define required environment variables
   - `components.json`: Modify component library settings if needed

## Base Configuration

### TypeScript

The template leverages the workspace TypeScript configuration with Next.js-specific settings.

### Component Library

Uses shadcn/ui with a custom configuration that shares UI components from the shared UI workspace.

### Environment Variables

Type-safe environment variables are configured using `@t3-oss/env-nextjs`. Add your variables to:

- `env/server.ts` for server-only variables
- `env/client.ts` for client-safe variables

### Routing

Uses Declarative Routes for type-safe routing. See the routes documentation for details: [README.md](./routes/README.md)

## Development

1. Copy environment variables:

```bash
cp .env.example .env.local
```

2. Start the development server:

```bash
pnpm dev --filter <app-name>
```

## Project Structure

```
├── app/ # App Router pages and layouts
├── components/ # React components
├── env/ # Environment variable configuration
├── hooks/ # Custom React hooks
├── lib/ # Utility functions
└── routes/ # Type-safe route definitions
```

## Adding UI Components

Use the UI add command to add new shadcn/ui components:

```bash
pnpm ui:add <component-name>
```

This will add the component to the shared UI package and make it available to all apps.
