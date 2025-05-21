import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
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
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: { scope: "read:user user:email" }
      }
    })
  ],
  callbacks: {
    signIn: async (param) => {
      const { profile, account, user } = param;

      console.log("Auth profile object:", JSON.stringify(profile, null, 2));
      console.log("Auth user object:", JSON.stringify(user, null, 2));

      if (account?.provider !== "google" && account?.provider !== "github") {
        console.error("Invalid provider");
        return false;
      }

      let email = user?.email;
      if (!email && account?.provider === "github") {
        if (profile?.emails && Array.isArray(profile.emails) && profile.emails.length > 0) {
          const primaryEmail = profile.emails.find((e) => e.primary) || profile.emails[0];
          email = primaryEmail.email || primaryEmail.value;
        }

        if (!email) {
          email = profile?.email;
        }
      }

      const name = user?.name || profile?.name;
      const image = user?.image || profile?.avatar_url;

      if (!email || typeof email !== "string") {
        console.error("Invalid email");
        console.warn("Auth param:", JSON.stringify(param, null, 2));

        if (account?.provider === "github" && name && typeof name === "string") {
          console.log("Using GitHub username as fallback identifier since email is not available");
          email = `${name.toLowerCase().replace(/\s+/g, "")}@github.user.pulkitxm.com`;
        } else {
          return false;
        }
      }

      const dbUser = await prisma.user.findUnique({
        where: {
          email
        }
      });

      if (dbUser) {
        await prisma.user.update({
          where: {
            email
          },
          data: {
            loginJson: param as {
              user: { email?: string | null; name?: string | null; image?: string | null };
              account: { provider: string } | null;
              profile?: { email?: string; name?: string; avatar_url?: string };
            },
            loginProvider: account?.provider === "google" ? "GOOGLE" : "GITHUB",
            updatedAt: new Date()
          }
        });
        return true;
      }

      await prisma.user.create({
        data: {
          name,
          email,
          image: typeof image === "string" ? image : undefined,
          loginJson: param as {
            user: { email?: string | null; name?: string | null; image?: string | null };
            account: { provider: string } | null;
            profile?: { email?: string; name?: string; avatar_url?: string };
          },
          loginProvider: account?.provider === "google" ? "GOOGLE" : "GITHUB",
          updatedAt: new Date(),
          createdAt: new Date()
        }
      });

      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        const email = token?.email || session.user.email;

        if (!email) {
          console.error("No email found in session or token");

          if (session.user.name) {
            const githubEmail = `${session.user.name.toLowerCase().replace(/\s+/g, "")}@github.user.pulkitxm.com`;
            const dbUserByName = await prisma.user.findUnique({
              where: { email: githubEmail },
              select: {
                id: true,
                isBlocked: true
              }
            });

            if (dbUserByName) {
              session.user.id = dbUserByName.id.toString();
              session.user.isAdmin = false;

              if (dbUserByName.isBlocked) {
                throw new Error("User is blocked");
              }

              return session;
            }
          }
          return session;
        }

        const dbUser = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            isBlocked: true
          }
        });

        if (dbUser) {
          session.user.id = dbUser.id.toString();
          session.user.isAdmin = email === profile.email;

          if (dbUser.isBlocked) {
            throw new Error("User is blocked");
          }
        } else {
          console.error(`User with email ${email} not found in database`);
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
    maxAge: 15 * 60
  }
});

export { auth, handlers, signIn, signOut, unstable_update };
