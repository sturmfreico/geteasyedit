import { authenticateAdmin, type Store } from './utils';

// Example middleware for Astro or similar frameworks
export async function onRequest(context: any, next: any) {
  const { request, redirect } = context;
  const url = new URL(request.url);
  
  // Only apply authentication to admin routes
  if (url.pathname.startsWith('/app/admin')) {
    // Get store data from session, cookies, or database
    // This is a placeholder - replace with your actual store retrieval logic
    const store: Store = await getStoreFromSession(request);
    
    const authResult = authenticateAdmin(store);
    
    // Handle authentication result
    if (typeof authResult === 'object' && !authResult.success && authResult.redirect) {
      return redirect(authResult.redirect.destination, authResult.redirect.permanent ? 301 : 302);
    }
  }
  
  return next();
}

// Placeholder function - replace with your actual store retrieval logic
async function getStoreFromSession(request: Request): Promise<Store> {
  // Example implementation - this would typically:
  // 1. Extract session/auth token from cookies or headers
  // 2. Query your database/API to get store information
  // 3. Return the store object with plan and onboarded status
  
  // For demonstration purposes, returning a mock store
  // In a real implementation, this would come from your database/API
  return {
    id: 'example-store-id',
    domain: 'example-shop.myshopify.com',
    plan: null, // This will trigger the redirect to /app/plans
    onboarded: true
  };
}

// Example usage in a component or page
export function useAuthenticatedStore() {
  return {
    checkAuthentication: (store: Store) => {
      return authenticateAdmin(store);
    },
    requireAuthentication: (store: Store) => {
      const result = authenticateAdmin(store);
      if (typeof result === 'object' && !result.success) {
        throw new Error(result.message || 'Authentication failed');
      }
      return true;
    }
  };
}