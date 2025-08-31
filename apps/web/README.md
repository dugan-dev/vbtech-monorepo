# VB Tech Website

This is the VB Tech marketing website built with Next.js 15 and the App Router. It showcases our company, products, and services with a focus on VB Pay - our healthcare payment administration solution.

## Features

- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- shadcn/ui components with custom VB Tech theme
- Type-safe routing with Declarative Routes
- Type-safe environment variables with t3-env
- Cal.com integration for demo scheduling
- Google Analytics and LinkedIn Insight Tag integration
- Vercel Speed Insights for performance monitoring
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
pnpm dev --filter web
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the site.

## Project Structure

```
├── app/ # App Router pages and layouts
├── components/ # React components
├── env/ # Environment variable configuration
├── hooks/ # Custom React hooks
├── lib/ # Utility functions
└── routes/ # Type-safe route definitions
```

## Key Components

- `Hero`: Main landing section with VB Pay introduction
- `Features`: Showcases key features of VB Pay
- `CalcomButton`: Integration with Cal.com for demo scheduling
- `Header/Footer`: Site-wide navigation and branding
- `HLTH2024Banner`: Event-specific promotional banner

## Environment Variables

Type-safe environment variables are configured using `@t3-oss/env-nextjs`. Add your variables to:

- `env/server.ts` for server-only variables
- `env/client.ts` for client-safe variables

## Analytics and Tracking

The site includes several tracking and analytics tools:

- Google Analytics (GA4)
- LinkedIn Insight Tag
- Vercel Speed Insights

## Deployment

The site is deployed on Vercel with automatic deployments from the main branch. Environment variables should be configured in the Vercel project settings.

## Adding UI Components

Use the UI add command to add new shadcn/ui components:

```bash
pnpm ui:add <component-name>
```

This will add the component to the shared UI package and make it available to the website.
