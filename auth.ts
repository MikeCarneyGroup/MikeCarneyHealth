import NextAuth from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';
import EmailProvider from 'next-auth/providers/email';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from './lib/db';
import { authConfig } from './auth.config';
import { sendVerificationRequest } from './lib/auth/send-verification';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db),
  session: { strategy: 'jwt' },
  providers: [
    AzureADProvider({
      clientId: process.env.AUTH_AZURE_AD_ID!,
      clientSecret: process.env.AUTH_AZURE_AD_SECRET!,
      tenantId: process.env.AUTH_AZURE_AD_TENANT_ID,
      authorization: { params: { scope: 'openid profile email User.Read' } },
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest,
    }),
  ],
});
