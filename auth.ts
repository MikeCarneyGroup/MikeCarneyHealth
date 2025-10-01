import NextAuth from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';
import EmailProvider from 'next-auth/providers/email';
import { db } from './lib/db';
import { users } from './lib/db/schema';
import { authConfig } from './auth.config';
import { sendVerificationRequest } from './lib/auth/send-verification';
import { eq } from 'drizzle-orm';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: 'jwt' },
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile, email }) {
      // Call the existing signIn callback from authConfig
      const isAllowed = await authConfig.callbacks?.signIn?.({ user, account, profile, email, credentials: undefined });
      if (!isAllowed) return false;

      // Ensure user exists in database
      if (user.email) {
        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, user.email),
        });

        if (!existingUser) {
          // Create new user
          await db.insert(users).values({
            email: user.email,
            name: user.name || null,
            image: user.image || null,
            emailVerified: email?.verificationRequest ? null : new Date(),
            role: 'staff',
          });
        } else {
          // Update existing user ID for session
          user.id = existingUser.id;
          user.role = existingUser.role;
        }
      }

      return true;
    },
    async jwt({ token, user, account, profile }) {
      // Add role to token on sign in
      if (user) {
        const dbUser = await db.query.users.findFirst({
          where: eq(users.email, user.email!),
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }
      return token;
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
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest,
    }),
  ],
});
