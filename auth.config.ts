import type { NextAuthConfig } from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';
import EmailProvider from 'next-auth/providers/email';
import { sendVerificationRequest } from './lib/auth/send-verification';

const ALLOWED_DOMAINS = [
  'lexusoftownsville.com.au',
  'mikecarneytoyota.com.au',
  'inghamtoyota.com.au',
  'charterstowerstoyota.com.au',
  'mikecarneymahindra.com.au',
  '4wdc.com.au',
];

export const authConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnProtectedRoute = 
        nextUrl.pathname.startsWith('/dashboard') ||
        nextUrl.pathname.startsWith('/news') ||
        nextUrl.pathname.startsWith('/policies') ||
        nextUrl.pathname.startsWith('/events') ||
        nextUrl.pathname.startsWith('/submissions') ||
        nextUrl.pathname.startsWith('/downloads') ||
        nextUrl.pathname.startsWith('/admin');
      
      if (isOnProtectedRoute) {
        if (isLoggedIn) return true;
        return false;
      }
      return true;
    },
    async signIn({ user, account, profile }) {
      // Check if email domain is allowed
      const email = user.email?.toLowerCase();
      if (!email) return false;

      const emailDomain = email.split('@')[1];
      const isAllowedDomain = ALLOWED_DOMAINS.includes(emailDomain);

      if (!isAllowedDomain) {
        return false;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as 'staff' | 'editor' | 'admin';
      }
      return session;
    },
  },
  providers: [], // Providers will be added in auth.ts
} satisfies NextAuthConfig;
