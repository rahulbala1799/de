import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Temporary hardcoded admin user for initial deployment
        if (credentials.email === 'admin@burgerpalace.com' && credentials.password === 'admin123') {
          return {
            id: 'user-1',
            email: 'admin@burgerpalace.com',
            name: 'Admin User',
            role: 'admin',
            restaurantId: 'restaurant-1',
          };
        }

        return null;
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.restaurantId = user.restaurantId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.restaurantId = token.restaurantId as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};
