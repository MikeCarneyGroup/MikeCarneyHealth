import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'staff' | 'editor' | 'admin';
    } & DefaultSession['user'];
  }

  interface User {
    role: 'staff' | 'editor' | 'admin';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: 'staff' | 'editor' | 'admin';
    email?: string;
  }
}
