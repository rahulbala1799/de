import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      restaurantId?: string;
    };
  }

  interface User {
    role: string;
    restaurantId?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string;
    restaurantId?: string;
  }
}
