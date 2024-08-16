import { type AuthOptions } from "next-auth";
import { pool, query } from "@/lib/database/db";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import PostgresAdapter from "@auth/pg-adapter";
import { Adapter } from "next-auth/adapters";
import { compare } from "bcrypt";

const clientId = process.env.GOOGLE_CLIENT_ID as string;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET as string;
const secret = process.env.NEXTAUTH_SECRET as string;

if (!clientId || !clientSecret) console.log("======== Error =========");

export const authOptions: AuthOptions = {
  adapter: PostgresAdapter(pool) as Adapter,
  providers: [
    GoogleProvider({
      clientId,
      clientSecret,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          const { email, password } = credentials as {
            email: string;
            password: string;
          };

          console.log("Attempting login for email:", email);

          const res = await query("SELECT * FROM users WHERE email = $1", [
            email,
          ]);
          console.log("Database query result:", res.rows);

          const user = res.rows[0];

          if (!user) {
            console.log("No user found with this email");
            return null;
          }

          const isCorrectPass = await compare(password, user.password);
          console.log("Password correct:", isCorrectPass);

          if (!isCorrectPass) {
            console.log("Incorrect password");
            return null;
          }

          console.log("Login successful, returning user:", {
            id: user.id,
            name: user.name,
            email: user.email,
          });

          return {
            id: user.id,
            name: user.name,
            image: user.image,
            email: user.email,
          };
        } catch (error) {
          console.error("Error in authorize function:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Store the user id in the JWT
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/auth-success",
    error: "/auth/auth-error",
  },
  session: {
    strategy: "jwt",
    maxAge: 3 * 24 * 60 * 60,
  },
  secret,
};
