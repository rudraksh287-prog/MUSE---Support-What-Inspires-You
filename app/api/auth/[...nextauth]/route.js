

import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import mongoose from "mongoose";
import User from "@/models/User";
import Payment from "@/models/Payment";
import connectDb from "@/db/connectDb";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],

  callbacks: {
  
    async signIn({ user, account }) {
  try {
    await connectDb();

    if (account.provider === "github") {
      const currentUser = await User.findOne({
        email: user.email,
      });

      if (!currentUser) {
        await User.create({
          email: user.email,
          username: user.email.split("@")[0],
        });
      }
    }

    return true;
  } catch (err) {
    console.error("SIGN IN ERROR:", err);
    return false;
  }
},
    async session({session,user,token}){
      await connectDb()
      const dbUser= await User.findOne({email: session.user.email})
      session.user.name=dbUser.username
      return session

    },
  }
});

export const { GET, POST } = handlers;