
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/prisma/prisma-client";
import { compare } from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import { PrismaClient } from "@prisma/client";


export const dbClient = new PrismaClient();
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(dbClient) as AuthOptions['adapter'],
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: 587,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const values = {
          email: credentials.email,
        };

        const findUser = await prisma.user.findFirst({
          where: values,
        });

        if (!findUser) {
          return null;
        }

        const isPassword = await compare(
          credentials.password,
          findUser.password
        );

        if (!isPassword) {
          return null;
        }

        return {
          id: findUser.id,
          email: findUser.email,
          name: findUser.firstName,
          role: findUser.role,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {

        if (account?.provider === "credentials") {
          console.log('всё кайф')
          return true;
        }
        if (!user?.email) {
          return false;
        }
        if (account?.provider === "email") {
          console.log(profile)
          const userExists = await prisma.user.findFirst({
            where: {
              email: user.email,
            }

          });
          if (userExists) {
            return true;
          } else {
            return false;
          }
        }
        const findUser = await prisma.user.findFirst({
          where: {
            email: user.email,
          },
        });
        console.log(findUser)
        return !!findUser;
      } catch (error) {
        console.log("Error [SIGN IN]", error);
      }
      return false;
    },
    async jwt({ token }) {
      if (!token.email) {
        return token;
      }
      const findUser = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
      });
      if (findUser) {
        token.id = findUser.id;
        token.email = findUser.email;
        token.name = findUser.firstName;
        token.role = findUser.role;
      }

      return token;
    },

    session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }
