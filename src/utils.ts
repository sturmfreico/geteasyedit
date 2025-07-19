// Format the date to a string
function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Date(date).toLocaleDateString(undefined, options);
}

// Capitalize the first letter
function capitalize(str: string): string {
  if (typeof str !== 'string' || str.length === 0) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Types for authentication
interface Store {
  plan?: string | null;
  onboarded?: boolean;
  id?: string;
  domain?: string;
}

interface AuthResult {
  success: boolean;
  redirect?: {
    destination: string;
    permanent: boolean;
  };
  message?: string;
}

// Authentication function for admin users
function authenticateAdmin(store: Store): AuthResult | boolean {
  // Validate store object
  if (!store || typeof store !== 'object') {
    console.error('authenticateAdmin: Invalid store object provided');
    return {
      success: false,
      message: 'Invalid store data'
    };
  }

  // Check if the store has a plan value set
  if (!store.plan || store.plan === null || store.plan.trim() === '') {
    console.warn('authenticateAdmin: Store does not have a plan set, redirecting to plans page');
    
    // Redirect to the plans page if no plan is set
    if (typeof window !== 'undefined') {
      // Client-side redirect
      window.location.href = '/app/plans';
      return false;
    } else {
      // Server-side redirect (for SSR contexts)
      return {
        success: false,
        redirect: {
          destination: '/app/plans',
          permanent: false,
        },
        message: 'Store plan not configured'
      };
    }
  }

  // Check if the store is onboarded (similar pattern as requested)
  if (store.onboarded === false) {
    console.warn('authenticateAdmin: Store is not onboarded, redirecting to onboarding');
    
    // Redirect to onboarding if not onboarded
    if (typeof window !== 'undefined') {
      // Client-side redirect
      window.location.href = '/app/onboarding';
      return false;
    } else {
      // Server-side redirect (for SSR contexts)
      return {
        success: false,
        redirect: {
          destination: '/app/onboarding',
          permanent: false,
        },
        message: 'Store onboarding incomplete'
      };
    }
  }

  // Authentication successful
  console.log('authenticateAdmin: Authentication successful for store:', store.id || 'unknown');
  return {
    success: true,
    message: 'Authentication successful'
  };
}

// Helper function to check if admin is authenticated (returns boolean only)
function isAdminAuthenticated(store: Store): boolean {
  const result = authenticateAdmin(store);
  if (typeof result === 'boolean') {
    return result;
  }
  return result.success;
}

export { formatDate, capitalize, authenticateAdmin, isAdminAuthenticated, type Store, type AuthResult };