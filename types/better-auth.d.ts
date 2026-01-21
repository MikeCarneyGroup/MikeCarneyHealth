import 'better-auth';

declare module 'better-auth' {
  interface User {
    role: 'staff' | 'editor' | 'admin';
  }

  interface Session {
    user: {
      id: string;
      role: 'staff' | 'editor' | 'admin';
      email: string;
      name?: string | null;
      image?: string | null;
    };
  }
}

// Export Session type for use in components
export type Session = {
  user: {
    id: string;
    role: 'staff' | 'editor' | 'admin';
    email: string;
    name?: string | null;
    image?: string | null;
  };
};
