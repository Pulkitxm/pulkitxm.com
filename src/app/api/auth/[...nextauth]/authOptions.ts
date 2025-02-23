import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

import { GITHUB_ID, GITHUB_SECRET } from "@/lib/constants";

const { auth, handlers, signIn, signOut, unstable_update } = NextAuth({
  providers: [
    GitHubProvider({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET
    })
  ]
});

export { auth, handlers, signIn, signOut, unstable_update };
