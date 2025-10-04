# VB UM Eval Tool

VBUM is a utilization management evaluation tool designed for managing utilization reviews, clients, and health plans for healthcare providers.

## Tech Stack

- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- shadcn/ui components with custom theme
- Type-safe routing using Declarative Routes
- Type-safe environment variables
- Automatic component imports
- Custom font configuration (Play)

## Development

1. Install dependencies:

```bash
pnpm install
```

2. Copy environment variables(if any):

```bash
cp .env.example .env.local
```

3. Start the development server:

```bash
pnpm dev --filter vbum
```

4. Access the site at: [https://localhost:3000](https://localhost:3000)

## Project Structure

```
apps/vbum/
├── app/ # App pages and API routes
├── components/ # Reusable UI components
├── env/ # Environment configuration
├── hooks/ # Custom React hooks
├── repos/ # Data access layer
├── routes/ # Type-safe route definitions
├── types/ # TypeScript type definitions
├── utils/ # Utility functions
└── values/ # Application constants
```

## Environment Variables

Type-safe environment variables are configured using `@t3-oss/env-nextjs`. Add your variables to:

- `env/server.ts` for server-only variables
- `env/client.ts` for client-safe variables

## Adding UI Components

Use the UI add command to add new shadcn/ui components:

```bash
pnpm ui:add <component-name>
```

This will add the component to the shared UI package and make it available to the website.

## Documentation

For more details about the routing system and type-safe features, refer to the documentation in the routes/README.md file.
