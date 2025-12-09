import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";
import { compare } from "bcrypt";
import prisma from "@/lib/database/prisma";
import { AuthError, login } from "./login";

// Environment variables
const clientId = process.env.GOOGLE_CLIENT_ID as string;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET as string;
const secret = process.env.NEXTAUTH_SECRET as string;

// Safety check for Google OAuth credentials
if (!clientId || !clientSecret) {
  console.error("Google OAuth credentials are missing");
}


// Main NextAuth configuration
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,

  providers: [
    // -----------------------------
    // Google OAuth Provider
    // -----------------------------
    GoogleProvider({
      clientId,
      clientSecret,
    }),

    // -----------------------------
    // Credentials (Email + Password)
    // -----------------------------
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },

      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) 
            throw new AuthError("MISSING_CREDENTIALS");
          
          const user = login(credentials.email as string, credentials.password as string);

          return user;
        } catch (error) {
          if (error instanceof AuthError) {
            throw error;
          }

          console.error("UNEXPECTED_AUTH_ERROR:", error);
          throw new AuthError("UNKNOWN_ERROR");
        }
      },
    }),
  ],

  // -----------------------------
  // Callbacks
  // -----------------------------
  callbacks: {
    // Add user ID to session object
    async session({ session, token }) {
      if (session.user && token?.id) {
        session.user.id = token.id as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.role = token.role as "STUDENT" | "TEACHER" | "ADMIN";
      }
      return session;
    },

    // Store user ID inside JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isVerified = user.isVerified;
        token.role = user.role;
      }
      return token;
    },
  },

  // -----------------------------
  // Events
  // -----------------------------
  events: {
    // When a new user signs up using Google
    async createUser({ user }) {
      if (!user?.email) return;

      // Auto-verify Google users
      await prisma.user.update({
        where: { email: user.email },
        data: { isVerified: true },
      });
    },
  },

  // -----------------------------
  // Custom Pages
  // -----------------------------
  pages: {
    signIn: "/auth/signin",
  },

  // -----------------------------
  // Session Configuration
  // -----------------------------
  session: {
    strategy: "jwt",
    maxAge: 3 * 24 * 60 * 60,
  },

  secret,
});
