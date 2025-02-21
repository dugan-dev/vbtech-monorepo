# VB Pay

VBPay is a payment administration platform designed for managing payments in Accountable Care Organizations (ACO) and Value-Based Care (VBC) environments. It provides a robust interface for handling payment-related operations and administrative tasks.

## Tech Stack

- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- shadcn/ui components with custom theme
- Type-safe routing using Declarative Routes
- Type-safe environment variables
- Automatic component imports
- Custom font configuration (Geist)

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   Set up environment variables:
   ```

cp .env.example .env
Update the following configuration files as needed:

next.config.ts - Next.js configuration
env/server.ts - Server environment variables
env/client.ts - Client environment variables
components.json - UI component configuration
Development
pnpm dev
The application will be available at http://localhost:3001.

Project Structure
apps/vbpay/
├── app/ # App pages and API routes
├── components/ # Reusable UI components
├── env/ # Environment configuration
├── hooks/ # Custom React hooks
├── routes/ # Type-safe route definitions
└── utils/ # Utility functions
Adding New UI Components
pnpm ui:add [component-name]
Type-Safe Features
Routing: Using Declarative Routes for type-safe navigation
Environment Variables: Zod schema validation for runtime safety
API Routes: Type-safe API endpoints with request/response validation
Documentation
For more details about the routing system and type-safe features, refer to the documentation in the routes/README.md file.
