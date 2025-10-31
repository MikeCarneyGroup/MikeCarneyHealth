import { handlers } from '@/auth';

export const { GET, POST } = handlers;

// Handle HEAD requests from email protection services (e.g., Outlook SafeLinks)
// HEAD requests should return the same headers as GET but without a body
export async function HEAD() {
  return new Response(null, { status: 200 });
}