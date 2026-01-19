// Re-export Better Auth for backward compatibility during migration
// This allows existing imports from '@/auth' to continue working
import { auth as betterAuth } from '@/lib/auth/better-auth';
import { headers } from 'next/headers';

// Server-side auth function (replaces NextAuth's auth())
// Returns a session compatible with NextAuth Session type
export async function auth() {
  const session = await betterAuth.api.getSession({
    headers: await headers(),
  });
  
  if (!session) return null;
  
  // Ensure role is included (should be set by callback, but type-safe fallback)
  return {
    user: {
      id: session.user.id,
      role: ((session.user as any).role || 'staff') as 'staff' | 'editor' | 'admin',
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
    },
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  };
}

// Export the Better Auth instance for advanced usage
export { betterAuth as authInstance };

// Client-side exports
export { createAuthClient } from 'better-auth/react';
