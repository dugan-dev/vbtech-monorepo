# Main Sidebar Component

A shared, generic main sidebar component that can be used across different applications while preserving all existing styling, icons, animations, and functionality.

## Features

- **Generic Design**: Uses TypeScript generics for type-safe user role and user type handling
- **App-Specific Configuration**: Accepts app-specific configuration, icons, components, and hooks as props
- **Built-in Filtering**: Automatically filters navigation items based on user permissions (isAdminOnly, allowedUserTypes, requiredRoles)
- **State Persistence**: Automatically saves collapsible item states to cookies and restores them on page refresh
- **Smooth Animations**: Includes smooth chevron rotation animations and collapsible content transitions
- **License Checking**: Optional license validation for apps that require it
- **Framework Agnostic**: Avoids framework dependencies by accepting components as props
- **Logout State Reset**: Provides utility function to clear sidebar state when user logs out

## Usage

### Basic Setup

```tsx
import {
  MainSidebar,
  type MainSidebarConfig,
} from "@workspace/ui/components/main-sidebar/main-sidebar";

// App-specific configuration
const config: MainSidebarConfig<UserRole, UserType> = {
  appTitle: "My App",
  appVersion: "v1.0.0",
  logoIcon: MyLogoIcon,
  logoIconDark: MyLogoDarkIcon,
  navigationItems: [
    {
      title: "Home",
      icon: HomeIcon,
      href: "/",
    },
    {
      title: "Admin",
      icon: AdminIcon,
      isAdminOnly: true,
      items: [
        {
          title: "Users",
          icon: UsersIcon,
          href: "/admin/users",
          isAdminOnly: true,
        },
      ],
    },
  ],
};

// In your component
<MainSidebar<UserRole, UserType>
  config={config}
  userData={{
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
  }}
  userAppAttrs={{
    type: userType,
    roles: userRoles,
    isAdmin: isAdmin,
    slug: userSlug,
  }}
  icons={{
    chevronDown: ChevronDownIcon,
    chevronRight: ChevronRightIcon,
  }}
  components={{
    ThemeToggle,
    UserAvatar,
    Link,
  }}
  pathname={pathname}
/>;
```

### Required Props

- **config**: App-specific configuration including title, version, logo, and navigation items
- **userData**: User information for the footer display
- **userAppAttrs**: User application attributes for filtering navigation items
- **icons**: App-specific icons (chevronDown and chevronRight for animations)
- **components**: App-specific components (ThemeToggle, UserAvatar, Link)
- **pathname**: Current pathname for active state detection

### Navigation Item Filtering

The component automatically filters navigation items based on user attributes:

- **isAdminOnly**: Only shows if user is admin
- **allowedUserTypes**: Only shows if user type is in the allowed list
- **requiredRoles**: Only shows if user has at least one of the required roles

```tsx
const navigationItems = [
  {
    title: "Admin Panel",
    icon: AdminIcon,
    isAdminOnly: true, // Only visible to admins
  },
  {
    title: "User Dashboard",
    icon: DashboardIcon,
    allowedUserTypes: ["admin", "user"], // Only visible to these user types
  },
  {
    title: "Reports",
    icon: ReportsIcon,
    requiredRoles: ["manager", "analyst"], // Only visible if user has these roles
  },
];
```

### State Persistence

The component automatically saves the open/closed state of collapsible items to an app-specific cookie named `sidebar-collapsible-state-{app-title}`. This state persists across page refreshes and browser sessions (15-minute expiration, 5 minutes after auto-logout).

**App-specific cookies prevent conflicts when users access multiple apps:**

- VB Call: `sidebar-collapsible-state-vb-call`
- VB Pay: `sidebar-collapsible-state-vb-pay`

### Logout State Reset

To ensure a clean state for the next user, call `clearSidebarState()` when the user logs out:

```tsx
import { clearSidebarState } from "@workspace/ui/components/main-sidebar/main-sidebar";

// In your logout function
const handleLogout = async () => {
  clearSidebarState("Your App Title"); // Clear sidebar state for specific app
  await signOut(); // Your existing logout logic
};
```

This should be called in:

- Manual logout buttons
- Auto-logout hooks
- Session expiration handlers

### Animations

- **Chevron Rotation**: Smooth 90-degree rotation from chevron-right to chevron-down when items are expanded
- **Content Transitions**: Smooth height animations for collapsible content using CSS transitions
- **Duration**: 200ms ease-out transitions for all animations

### License Checking

For apps that require license validation:

```tsx
const config: MainSidebarConfig<UserRole, UserType> = {
  // ... other config
  hasLicense: !!license, // Pass license status
};
```

When `hasLicense` is false, navigation items will be disabled and show appropriate visual feedback.

## Type Safety

The component uses TypeScript generics to ensure type safety:

- `TUserRole`: The type for user roles in your application
- `TUserType`: The type for user types in your application

This eliminates the need for unsafe type casting and provides better IntelliSense support.

## Benefits

1. **Code Reuse**: Single implementation across multiple apps
2. **Consistency**: Uniform behavior and styling across applications
3. **Maintainability**: Changes to sidebar logic only need to be made in one place
4. **Type Safety**: Generic types prevent runtime errors
5. **User Experience**: Persistent state and smooth animations improve usability
6. **Flexibility**: App-specific customization through props
7. **Security**: Proper state cleanup on logout prevents data leakage between users
8. **Simplified API**: Built-in filtering eliminates the need for custom filter functions

## Migration from App-Specific Sidebars

When migrating from app-specific sidebar components:

1. Extract the configuration object from your existing sidebar
2. Pass app-specific icons, components, and hooks as props
3. Update the generic type parameters to match your user types
4. Add `clearSidebarState()` calls to your logout handlers
5. Remove the old sidebar component and filter functions

The shared component preserves all existing functionality while adding new features like state persistence, improved animations, proper logout cleanup, and built-in filtering.

## Files

- `main-sidebar.tsx` - The main generic sidebar component with built-in filtering
- `types/sidebar-nav-item.ts` - Generic type definitions
