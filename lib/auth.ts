import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const defaultUser = process.env.ADMIN_USERNAME;
        const defaultPass = process.env.ADMIN_PASSWORD;

        if (
          defaultUser &&
          defaultPass &&
          credentials.username === defaultUser &&
          credentials.password === defaultPass
        ) {
          return {
            id: "admin-id",
            name: defaultUser,
            role: "admin",
          };
        }

        try {
          await dbConnect();
          const user = await User.findOne({ username: credentials.username });
          if (user) {
            const isPasswordValid = await bcrypt.compare(
              credentials.password,
              user.password
            );

            if (isPasswordValid) {
              return {
                id: user._id.toString(),
                name: user.username,
                role: user.role || "user",
              };
            }
          }
        } catch (e) {
          console.error("Authorize: DB Error", e);
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: false,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
};