# @workspace/ui

Shared UI components, utilities, and hooks for VB Tech applications.

## Overview

This package contains reusable UI components, utilities, and hooks that are shared across VB Tech applications (VBCall, VBPay, etc.). It's built on top of shadcn/ui with custom theming and additional functionality.

## Features

- **Shared Components**: Reusable UI components built on shadcn/ui
- **Rate Limiting**: Built-in rate limiting utilities for API and page access
- **Form Components**: Enhanced form components with validation
- **Data Tables**: Advanced data table components with sorting, filtering, and pagination
- **Authentication**: Shared authentication components and utilities
- **Theme Support**: Custom VB Tech theme with light/dark mode
- **Type Safety**: Full TypeScript support with proper type definitions

## Installation

This package is automatically available in all workspace applications. No additional installation is required.

## Usage

### Importing Components

```tsx
// Basic UI components
import { AuthInitializer } from "@workspace/ui/components/auth/auth-initializer";
// Authentication components
import { AuthProvider } from "@workspace/ui/components/auth/auth-provider";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
// Data table components
import { DataTable } from "@workspace/ui/components/data-table";
// Form components
import { Form } from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { useForm } from "@workspace/ui/hooks/use-form";
import { formatDate } from "@workspace/ui/utils/format-date";
// Utility functions
import { getClientIP } from "@workspace/ui/utils/get-client-ip";
import { checkApiRateLimit } from "@workspace/ui/utils/rate-limit/check-api-rate-limit";
// Rate limiting utilities
import { checkPageRateLimit } from "@workspace/ui/utils/rate-limit/check-page-rate-limit";
```

### Rate Limiting

The package provides built-in rate limiting utilities for both API routes and page access:

#### Page Rate Limiting

```tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { checkPageRateLimit } from "@workspace/ui/utils/rate-limit/check-page-rate-limit";

export default async function Page() {
  await checkPageRateLimit({
    pathname: "/my-page",
    config: {
      getHeaders: headers,
      redirect,
      getRateLimitRoute: () => "/rate-limit",
      authenticatedUser: async () => ({ userId: "user123" }),
      getClientIp: (headers) => "127.0.0.1",
    },
  });

  return <div>Page content</div>;
}
```

#### API Rate Limiting

```tsx
import { headers } from "next/headers";

import { checkApiRateLimit } from "@workspace/ui/utils/rate-limit/check-api-rate-limit";

export async function POST(request: Request) {
  await checkApiRateLimit({
    getHeaders: headers,
    authenticatedUser: async () => ({ userId: "user123" }),
    getClientIp: (headers) => "127.0.0.1",
  });

  // Your API logic here
  return Response.json({ success: true });
}
```

### Form Components

Enhanced form components with built-in validation:

```tsx
import { z } from "zod";

import { Form } from "@workspace/ui/components/form";
import { useForm } from "@workspace/ui/hooks/use-form";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function MyForm() {
  const form = useForm({
    schema,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
```

### Data Tables

Advanced data table components with sorting, filtering, and pagination:

```tsx
import { ColumnDef } from "@tanstack/table-core";

import { DataTable } from "@workspace/ui/components/data-table";

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];

export function UsersTable({ users }: { users: User[] }) {
  return (
    <DataTable
      columns={columns}
      data={users}
      searchKey="name"
      searchPlaceholder="Search users..."
    />
  );
}
```

### Authentication Components

Shared authentication components:

```tsx
import { AuthInitializer } from "@workspace/ui/components/auth/auth-initializer";
import { AuthProvider } from "@workspace/ui/components/auth/auth-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthInitializer />
      {children}
    </AuthProvider>
  );
}
```

## Available Components

### Basic UI Components

- `Alert` - Alert messages with variants
- `AlertDialog` - Confirmation dialogs
- `Avatar` - User avatars with fallbacks
- `Badge` - Status badges and labels
- `Button` - Action buttons with variants
- `Card` - Content containers
- `Checkbox` - Form checkboxes
- `Dialog` - Modal dialogs
- `DropdownMenu` - Context menus
- `Form` - Form components with validation
- `Input` - Text input fields
- `Label` - Form labels
- `Select` - Dropdown selects
- `Sheet` - Slide-out panels
- `Table` - Data tables
- `Tabs` - Tabbed interfaces
- `Textarea` - Multi-line text inputs
- `Tooltip` - Hover tooltips

### Specialized Components

- `DataTable` - Advanced data tables with sorting/filtering
- `MainSidebar` - Application navigation sidebar
- `SteppedFormHeader` - Multi-step form headers
- `SteppedFormNavigationButtons` - Form navigation
- `EmptyView` - Empty state displays
- `ConfirmationDialog` - Confirmation dialogs
- `SignoutButton` - Logout buttons
- `ThemeToggle` - Dark/light mode toggle

### Authentication Components

- `AuthProvider` - Authentication context provider
- `AuthInitializer` - Authentication initialization
- `UpdatePasswordForm` - Password update forms

## Available Utilities

### Rate Limiting

- `checkPageRateLimit` - Page access rate limiting
- `checkApiRateLimit` - API route rate limiting

### Client Utilities

- `getClientIP` - Extract client IP from headers
- `formatDate` - Date formatting utilities
- `formatPhoneNumber` - Phone number formatting
- `formatTaxId` - Tax ID formatting
- `getErrorMessage` - Error message extraction

### Validation

- `validateStringIsNumbers` - Number string validation
- `validateStringIsUrl` - URL validation

## Available Hooks

- `useForm` - Enhanced form hook with validation
- `useAutoLogout` - Automatic logout functionality
- `useConfirmationDialog` - Confirmation dialog state
- `useDataTableBatchActionDropdown` - Data table batch actions

## Styling

The package includes a custom VB Tech theme with:

- Light and dark mode support
- Custom color palette
- Consistent spacing and typography
- Responsive design utilities

### CSS Variables

The theme uses CSS custom properties for runtime theming:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* ... more variables */
}
```

## Type Safety

All components and utilities are fully typed with TypeScript. The package exports type definitions for:

- Component props
- Form schemas
- Data table configurations
- Rate limiting configurations
- Authentication types

## Contributing

When adding new components to this package:

1. Follow the existing component patterns
2. Include proper TypeScript types
3. Add JSDoc comments for complex components
4. Update this README with new components
5. Ensure components are generic and reusable
6. Test components across different applications

## Migration Guide

When migrating from app-specific components to this shared package:

1. Replace local component imports with `@workspace/ui` imports
2. Update any app-specific prop interfaces to use the generic versions
3. Remove duplicate component files from individual apps
4. Update any custom styling to use the shared theme variables

## Examples

See the individual application READMEs for specific usage examples:

- [VBCall README](../../apps/vbcall/README.md)
- [VBPay README](../../apps/vbpay/README.md)
