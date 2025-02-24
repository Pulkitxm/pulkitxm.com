import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import profile from "@/data/profile";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "@/lib/constants";

import { prisma } from "./prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      isAdmin: boolean;
    };
  }
}

const { auth, handlers, signIn, signOut, unstable_update } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET
    })
  ],
  callbacks: {
    signIn: async (param) => {
      const { profile, account, user } = param;
      if (account?.provider !== "google") {
        console.error("Invalid provider");
        return false;
      }

      const email = user?.email || profile?.email;
      const name = user?.name || profile?.name;
      const image = user?.image || profile?.avatar_url;

      if (!email || typeof email !== "string") {
        console.error("Invalid email");
        return false;
      }

      const dbUser = await prisma.user.findUnique({
        where: {
          email
        }
      });

      if (dbUser) return true;

      await prisma.user.create({
        data: {
          name,
          email,
          image: typeof image === "string" ? image : undefined,
          loginJson: param as {
            user: { email?: string | null; name?: string | null; image?: string | null };
            account: { provider: string } | null;
            profile?: { email?: string; name?: string; avatar_url?: string };
          }
        }
      });

      return true;
    },
    async session({ session }) {
      if (session.user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email! },
          select: {
            id: true,
            isBlocked: true
          }
        });

        if (dbUser) {
          session.user.id = dbUser.id.toString();
          session.user.isAdmin = session.user.email === profile.email;

          if (dbUser.isBlocked) {
            throw new Error("User is blocked");
          }
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
      }
      return token;
    }
  },
  session: {
    maxAge: 15 * 60 // 15 minutes
  }
});

export { auth, handlers, signIn, signOut, unstable_update };
