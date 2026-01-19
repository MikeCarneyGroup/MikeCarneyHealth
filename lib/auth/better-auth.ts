import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { magicLink } from 'better-auth/plugins';
import { db } from '@/lib/db';
import { users, accounts, sessions, verificationTokens } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import FormData from 'form-data';
import Mailgun from 'mailgun.js';
import { generateEmailHTML, generateEmailText } from './email-templates';

// Allowed email domains for sign-in
const ALLOWED_DOMAINS = [
  'lexusoftownsville.com.au',
  'mikecarneytoyota.com.au',
  'inghamtoyota.com.au',
  'charterstowerstoyota.com.au',
  'charterstowersthmahindra.com.au',
  'mikecarneymahindra.com.au',
  '4wdc.com.au',
];

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: users,
      account: accounts,
      session: sessions,
      verification: verificationTokens,
    },
  }),
  // Map field names to match existing NextAuth schema
  session: {
    fields: {
      token: 'sessionToken', // Map token -> sessionToken
      expiresAt: 'expires', // Map expiresAt -> expires
      createdAt: 'created_at', // Map createdAt (Better Auth) -> created_at (schema property)
      updatedAt: 'updated_at', // Map updatedAt (Better Auth) -> updated_at (schema property)
      ipAddress: 'ip_address', // Map ipAddress (Better Auth) -> ip_address (schema property)
      userAgent: 'user_agent', // Map userAgent (Better Auth) -> user_agent (schema property)
    },
  },
  verification: {
    fields: {
      expiresAt: 'expires_at', // Map expiresAt (Better Auth) -> expires_at (schema property)
      createdAt: 'created_at', // Map createdAt (Better Auth) -> created_at (schema property)
      updatedAt: 'updated_at', // Map updatedAt (Better Auth) -> updated_at (schema property)
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }, ctx) => {
        // Validate email domain
        const emailDomain = email.split('@')[1]?.toLowerCase();
        if (!emailDomain || !ALLOWED_DOMAINS.includes(emailDomain)) {
          throw new Error('Access denied. Please use an authorized company email.');
        }

        // Send email via Mailgun
        const mailgun = new Mailgun(FormData);
        const mg = mailgun.client({
          username: 'api',
          key: process.env.MAILGUN_API_KEY || '',
        });

        const domain = process.env.MAILGUN_DOMAIN || '';
        const from = process.env.MAILGUN_FROM_EMAIL || 'noreply@mikecarneyhealth.com';

        try {
          await mg.messages.create(domain, {
            from: `Mike Carney Wellbeing Hub <${from}>`,
            to: [email],
            subject: 'Sign in to Mike Carney Wellbeing Hub',
            text: generateEmailText({ url }),
            html: generateEmailHTML({ url }),
          });
        } catch (error) {
          console.error('Failed to send magic link email:', error);
          throw new Error('Failed to send email. Please try again.');
        }
      },
      expiresIn: 300, // 5 minutes
      disableSignUp: false, // Allow new users to sign up
    }),
  ],
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'https://www.mikecarneyhealth.com',
  ],
  baseURL: process.env.AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  basePath: '/api/auth',
  advanced: {
    useSecureCookies: process.env.NODE_ENV === 'production',
    generateId: () => {
      // Use existing CUID2 generator
      const { createId } = require('@paralleldrive/cuid2');
      return createId();
    },
  },
  // Callbacks for role-based access
  callbacks: {
    async session({ session, user }: { session: any; user?: any }) {
      // Fetch user from database to get role
      if (user?.id) {
        const dbUser = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.id, user.id),
        });
        
        if (dbUser && session.user) {
          session.user.id = dbUser.id;
          session.user.role = (dbUser.role as 'staff' | 'editor' | 'admin') || 'staff';
        }
      }
      return session;
    },
  },
});
