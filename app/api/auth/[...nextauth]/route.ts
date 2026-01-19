import { auth } from '@/lib/auth/better-auth';
import { toNextJsHandler } from 'better-auth/next-js';

// Better Auth handler for Next.js
const handler = toNextJsHandler(auth);

export const { GET, POST } = handler;

// Handle HEAD requests from email protection services (e.g., Outlook SafeLinks)
// HEAD requests should return the same headers as GET but without a body
export async function HEAD() {
  return new Response(null, { status: 200 });
}