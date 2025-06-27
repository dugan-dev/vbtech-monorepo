# VB Tech Monorepo

This monorepo contains our IaC, frontend applications and shared packages. It uses Turborepo for build orchestration and pnpm for package management.

## Tech Stack

- **Package Management**: pnpm workspaces
- **Build System**: Turborepo
- **UI Framework**: Next.js 15 with App Router
- **UI Components**: shadcn/ui with custom theme
- **Type Safety**: TypeScript
- **API Type Safety**: Declarative Routing
- **Infrastructure**: SST (Serverless Stack)
- **Project Management**: Linear
- **CI/CD**: GitHub Actions

## Project Structure

```
apps/
├── next-15-template/ # Next.js 15 application template
packages/
├── ui/ # Shared UI components
├── eslint-config/ # Shared ESLint configuration
└── typescript-config/ # Shared TypeScript configuration
```

## Development

1. Install dependencies:

```bash
pnpm install
```

2. Start development server:

```bash
pnpm dev
```

## Infrastructure

We use SST (Serverless Stack) for infrastructure as code. The configuration can be found in `sst.config.ts`. Our infrastructure supports three stages:

- `<your-name>`: Individual's dev stage
- `dev`: Development environment (shared dev)
- `staging`: Staging environment
- `production`: Production environment

AWS profiles are automatically mapped to each stage:

- Production: `prod1` (us-west-2)
- Staging: `non-prod1` (us-west-2)
- Dev: `dev` (us-west-2)

More info on the workflow and SST [here](https://sst.dev/docs/workflow).

## UI Components

We use shadcn/ui for our component library. Components are stored in `packages/ui/src/components` and can be imported into any app:

```tsx
import { Button } from "@workspace/ui/components/button";
```

To add new shadcn/ui components, run:

```bash
pnpm ui:add <component-name>
```

## Type-Safe Routing

We use Declarative Routes for type-safe routing in Next.js applications. This ensures:

- Type-safe route parameters
- Type-safe search parameters
- Type-safe API inputs and outputs
- Auto-generated fetch functions

See `apps/next-15-template/routes/README.md` for detailed documentation on the routing system.

## Project Management

We use Linear for project management and issue tracking. All commits should include the Linear ticket number in the format:

```
[ABC-123] feat: add new feature
```

## Quality Checks

The repository includes several quality checks that run automatically:

- ESLint for code quality
- Prettier for code formatting
- TypeScript for type checking
- Husky for pre-commit hooks

These checks run both locally and in CI/CD pipelines.

## Theme Customization

We use a custom theme built on top of shadcn/ui. The theme colors are defined in `packages/ui/src/styles/globals.css` and include:

- Light and dark mode support
- Custom color palette based on VB brand colors
- CSS variables for runtime theme switching
- Tailwind CSS for styling

To modify the theme, edit the CSS variables in `packages/ui/src/styles/globals.css`.

## Contributing

1. Branch naming:
   - Feature: `feat/ABC-123-description`
   - Bug Fix: `fix/ABC-123-description`
   - Chore: `chore/ABC-123-description`

2. Commit messages must follow the format:

   ```
   [ABC-123] type: description
   ```

   Where type is one of: feat, fix, docs, style, refactor, test, chore

3. All PRs must:
   - Include Linear ticket number
   - Pass all CI checks
   - Have at least one approval
   - Be up to date with main

## Local Development Setup

1. Prerequisites:
   - Node.js >= 20
   - pnpm >= 10.4.1
   - AWS CLI configured with SSO

2. First-time setup:

   ```bash
   pnpm sso              # Login to AWS SSO
   pnpm install          # Install dependencies
   pnpm ui:add button    # Add initial UI components
   ```

3. Development workflow:

   ```bash
   pnpm dev             # Start all applications
   pnpm lint           # Run linting
   pnpm format         # Run formatting
   ```

4. Environment Variables:
   - Copy `.env.example` to `.env.local` in each app
   - See `env/server.ts` and `env/client.ts` for required variables

## Environment Variables

Environment variables are managed using `@t3-oss/env-nextjs` for type-safe environment variables. Define your environment variables in:

- `env/server.ts` for server-only variables
- `env/client.ts` for client-safe variables

## Application-Specific Documentation

Each application in the monorepo has its own README with detailed information about:

- Application architecture
- Component structure
- Data flow
- API endpoints
- Specific configuration requirements
- Local development instructions

## Testing (Coming Soon)

Testing infrastructure is currently being set up. This section will be updated with:

- Unit testing setup and conventions
- Integration testing strategy
- E2E testing with Playwright
- Test coverage requirements
- CI integration details

## Infrastructure Details (Coming Soon)

Additional infrastructure documentation is in progress. This section will be updated with:

- Detailed AWS resource configurations
- Infrastructure diagram
- Environment promotion workflow
- Monitoring and logging setup
- Performance optimization guidelines
- Security best practices

## Getting Help

For questions or issues:

1. Check the relevant package's README
2. Consult the team documentation in Linear
3. Reach out to the team on Slack
