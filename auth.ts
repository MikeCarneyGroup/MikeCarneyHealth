import NextAuth from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import AzureADProvider from 'next-auth/providers/azure-ad';
import EmailProvider from 'next-auth/providers/email';
import { db } from './lib/db';
import { users, accounts, verificationTokens } from './lib/db/schema';
import { authConfig } from './auth.config';
import { sendVerificationRequest } from './lib/auth/send-verification';
import { eq } from 'drizzle-orm';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    verificationTokensTable: verificationTokens,
  }),
  session: { strategy: 'jwt' },
  callbacks: {
    async authorized({ auth, request }) {
      return authConfig.callbacks!.authorized!({ auth, request });
    },
    async signIn({ user, account, profile, email, credentials }) {
      // Check if email domain is allowed
      const emailAddress = user.email?.toLowerCase();
      if (!emailAddress) return false;

      const emailDomain = emailAddress.split('@')[1];
      const ALLOWED_DOMAINS = [
        'lexusoftownsville.com.au',
        'mikecarneytoyota.com.au',
        'inghamtoyota.com.au',
        'charterstowerstoyota.com.au',
        'charterstowersthmahindra.com.au',
        'mikecarneymahindra.com.au',
        '4wdc.com.au',
      ];
      
      if (!ALLOWED_DOMAINS.includes(emailDomain)) {
        return false;
      }

      return true;
    },
    async jwt({ token, user, account, trigger }) {
      // On sign in, fetch user from database and add to token
      if (user?.email) {
        const dbUser = await db.query.users.findFirst({
          where: eq(users.email, user.email),
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.email = dbUser.email;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = (token.id as string) || '';
        session.user.role = (token.role as 'staff' | 'editor' | 'admin') || 'staff';
        session.user.email = (token.email as string) || session.user.email || '';
      }
      return session;
    },
  },
  providers: [
    // Azure AD temporarily disabled - uncomment when you have credentials
    // AzureADProvider({
    //   clientId: process.env.AUTH_AZURE_AD_ID!,
    //   clientSecret: process.env.AUTH_AZURE_AD_SECRET!,
    //   tenantId: process.env.AUTH_AZURE_AD_TENANT_ID,
    //   authorization: { params: { scope: 'openid profile email User.Read' } },
    // }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
        secure: false, // Use TLS
        tls: {
          rejectUnauthorized: false, // For development/testing only
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest,
    }),
  ],
});
