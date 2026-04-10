import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from './prisma';
import bcrypt from 'bcrypt';
import { decrypt } from './crypto';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const users = await prisma.user.findMany();
        const user = users.find(u => {
          try {
            return decrypt(u.email) === credentials.email;
          } catch {
            return false;
          }
        });

        if (user && await bcrypt.compare(credentials.password, user.passwordHash)) {
          return {
            id: user.id,
            email: credentials.email,
            name: user.name,
            role: user.role,
          } as any;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
        
        // Initial profile check
        if ((user as any).role === 'STUDENT') {
          const profile = await prisma.studentProfile.findUnique({
            where: { userId: user.id }
          });
          token.profileFilled = !!profile;
        } else {
          token.profileFilled = true;
        }
      }
      
      if (trigger === "update" && session?.profileFilled !== undefined) {
        token.profileFilled = session.profileFilled;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).profileFilled = token.profileFilled;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
};
