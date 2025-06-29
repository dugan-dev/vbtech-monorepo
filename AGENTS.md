# Agent Guidelines for VBTech Monorepo

## Build/Test Commands

- `pnpm build` - Build all apps/packages
- `pnpm dev` - Start development servers
- `pnpm lint` - Run ESLint across all packages
- `pnpm lint:fix` - Auto-fix linting issues
- `pnpm format` - Format code with Prettier
- `pnpm check-types` - TypeScript type checking
- For single app: `cd apps/[app-name] && pnpm [command]`

## Code Style

- Use TypeScript with strict mode
- Import order: React → Next → 3rd party → workspace packages → local imports (enforced via eslint-plugin-import)
- Use `@workspace/ui` for shared components
- Path aliases: `@/*` for local files, `@workspace/ui/*` for UI components
- Tailwind CSS for styling with shadcn/ui components
- Use `cn()` utility from `@workspace/ui/lib/utils` for conditional classes
- Export default for page components, named exports for utilities

## Naming Conventions

- Files: kebab-case (e.g., `user-avatar.tsx`)
- Components: PascalCase (e.g., `UserAvatar`)
- Variables/functions: camelCase
- Constants: UPPER_SNAKE_CASE

## Error Handling

- Use `@t3-oss/env-nextjs` (wraps Zod) for environment variable validation only
- Use Zod directly for runtime validation (API payloads, forms, user input)
- Prefer explicit error types over generic Error
