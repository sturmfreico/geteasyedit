# EasyEdit Admin Authentication System

This document explains how to use the `authenticateAdmin` function to check for store plans and handle redirects.

## Overview

The `authenticateAdmin` function checks if a store has the required configuration (plan and onboarding status) and redirects users to appropriate pages if these requirements are not met.

## Function Signature

```typescript
function authenticateAdmin(store: Store): AuthResult | boolean
```

### Store Interface

```typescript
interface Store {
  plan?: string | null;
  onboarded?: boolean;
  id?: string;
  domain?: string;
}
```

### AuthResult Interface

```typescript
interface AuthResult {
  success: boolean;
  redirect?: {
    destination: string;
    permanent: boolean;
  };
  message?: string;
}
```

## Authentication Logic

The function performs the following checks in order:

1. **Store Validation**: Ensures the store object is valid
2. **Plan Check**: Verifies that `store.plan` is set and not empty
   - If no plan: redirects to `/app/plans`
3. **Onboarding Check**: Verifies that `store.onboarded` is not `false`
   - If not onboarded: redirects to `/app/onboarding`

## Usage Examples

### Server-side (Astro Page)

```astro
---
import { authenticateAdmin, type Store } from '../utils';

// Get store from your session/database
const store: Store = await getStoreFromSession(Astro.request);

// Check authentication
const authResult = authenticateAdmin(store);

// Handle redirect
if (typeof authResult === 'object' && !authResult.success && authResult.redirect) {
  return Astro.redirect(authResult.redirect.destination);
}
---

<html>
  <!-- Your protected admin content -->
</html>
```

### Middleware Usage

```typescript
// src/middleware.ts
import { authenticateAdmin } from './utils';

export async function onRequest(context, next) {
  const { request, redirect } = context;
  const url = new URL(request.url);
  
  if (url.pathname.startsWith('/app/admin')) {
    const store = await getStoreFromSession(request);
    const authResult = authenticateAdmin(store);
    
    if (typeof authResult === 'object' && !authResult.success && authResult.redirect) {
      return redirect(authResult.redirect.destination);
    }
  }
  
  return next();
}
```

### Client-side Usage

```javascript
import { authenticateAdmin } from './utils';

// Check authentication on the client
const store = getCurrentStore(); // Get from your app state
const isAuthenticated = authenticateAdmin(store);

if (!isAuthenticated) {
  // User will be redirected automatically
  console.log('Authentication failed, redirecting...');
}
```

## Redirect Behavior

### Missing Plan
- **Client-side**: `window.location.href = '/app/plans'`
- **Server-side**: Returns redirect object to `/app/plans`

### Not Onboarded
- **Client-side**: `window.location.href = '/app/onboarding'`
- **Server-side**: Returns redirect object to `/app/onboarding`

## Helper Functions

### `isAdminAuthenticated(store: Store): boolean`

A simplified version that returns only a boolean result:

```typescript
const isAuthenticated = isAdminAuthenticated(store);
if (!isAuthenticated) {
  // Handle authentication failure
}
```

## Integration with Your App

### 1. Store Data Retrieval

Implement `getStoreFromSession()` to retrieve store data from your session management system:

```typescript
async function getStoreFromSession(request: Request): Promise<Store> {
  // Extract session token from cookies/headers
  // Query your database/API
  // Return store object
}
```

### 2. Update Astro Config for SSR (Optional)

If you want server-side redirects, update `astro.config.mjs`:

```javascript
export default defineConfig({
  output: "server", // Change from "static"
  // ... other config
});
```

### 3. Create Required Pages

Ensure you have the following pages:
- `/app/plans` - Plan selection page
- `/app/onboarding` - Onboarding flow
- `/app/admin/*` - Protected admin pages

## Testing

### Test Cases

1. **Valid Store**: Plan set, onboarded = true → Allow access
2. **Missing Plan**: Plan null/empty → Redirect to `/app/plans`
3. **Not Onboarded**: onboarded = false → Redirect to `/app/onboarding`
4. **Invalid Store**: null/undefined → Return error

### Example Test Store Objects

```typescript
// Valid store
const validStore = {
  id: 'test-store',
  plan: 'starter',
  onboarded: true
};

// Missing plan
const noPlanStore = {
  id: 'test-store',
  plan: null,
  onboarded: true
};

// Not onboarded
const notOnboardedStore = {
  id: 'test-store',
  plan: 'starter',
  onboarded: false
};
```

## Error Handling

The function includes comprehensive error handling:
- Validates store object existence
- Checks for empty/null plan values
- Provides detailed console logging
- Returns structured error messages

## Security Considerations

- Always validate store data server-side
- Use secure session management
- Implement proper authentication before calling this function
- Consider rate limiting for redirect endpoints
- Validate user permissions beyond plan/onboarding status

## Files Created/Modified

- `src/utils.ts` - Main authentication function
- `src/middleware.ts` - Example middleware implementation
- `src/pages/app/admin/dashboard.astro` - Example protected page
- `src/pages/app/plans.astro` - Plan selection page