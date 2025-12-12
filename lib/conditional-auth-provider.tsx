'use client';

import { usePathname } from 'next/navigation';
import { AuthProvider } from './auth-context';

/**
 * Conditional Auth Provider that only enables user authentication on non-admin routes
 * This prevents unnecessary API calls and console errors on admin pages
 */
export function ConditionalAuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Skip user authentication entirely on admin routes
  if (pathname?.startsWith('/admin')) {
    return <>{children}</>;
  }
  
  // Use regular auth provider for user routes
  return <AuthProvider>{children}</AuthProvider>;
}
