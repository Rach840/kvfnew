
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/prisma/prisma-client";
import { compare } from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import { PrismaClient } from "@prisma/client";
import { createTransport } from "nodemailer"

export const dbClient = new PrismaClient();

async function sendVerificationRequest(params) {
  const { identifier, url, provider } = params
  // NOTE: You are not required to use `nodemailer`, use whatever you want.
  const transport = createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },

  })

  const userVerified =  await prisma.user.findFirst({
    where: {
      email: identifier,
    },
  });
  const result = await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: `${userVerified.emailVerified ? 'Вход на сайт КВФ' :  "Вы зарегистрированы! Осталось подтвердить почту"}`,
    html:`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${userVerified.emailVerified ? 'Вход на сайт КВФ' :  "Вы зарегистрированы! Осталось подтвердить почту"}</title>
        <style>
   body {\n    background-color: #f4f4f4;\n    margin: 0;\n    padding: 20px;\n  }\n.container {\n    background-color: white;\n    border-radius: 5px;\n    color: #000;\n    padding: 20px;\n    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);\n    max-width: 600px;\n    margin: auto;\n    font-size: 1.3rem;\n  }\n  h1 {\n    font-size:1.4rem;\n    color: #ffbd33;\n  }\n.footer {\n    margin-top: 20px;\n    font-size: 0.9em;\n    color: #777;\n  }\n.button {\n    background-color: #ffbd33;\n    color: #fff;\n    padding: 10px 15px;\n    text-decoration: none;\n    border-radius: 5px;\n    display: inline-block;\n    margin-top: 20px;\n  }
  </style>
  </head>
  <body>
  <img src="https://asi24.ru/wp-content/uploads/2024/10/logoasi24.jpg" width="109" height="55"/>

  <div class="container">
      <h1>${userVerified.emailVerified ? 'Вход через почту на сайт КВФ' :  "Успешная регистрация!"}</h1>
      ${userVerified.emailVerified ? '' : `
  <p>Дорогой ${userVerified.firstName} вы зарегистрированы на КВф.</p>
  <p>Подтвердите электронную почту для доступа к тестам и командам</p>
  <p>Ждем вас в игре!</p>
      `}
  
  <p>${ userVerified.emailVerified ? 'Войдите в аккаунт, нажав на кнопку' : 'Подтвердите почту, нажав на кнопку'}.</p>

  <a href='${url}' class="button">${ userVerified.emailVerified ? 'Войти' : 'Подтвердить почту'} </a>

  <div class="footer">
      <p>C уважением,<br>
      АНО Агентство социальных инициатив</p>
  </div>
  </div>

  </body>
  </html>`,
  })
  const failed = result.rejected.concat(result.pending).filter(Boolean)
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`)
  }
}


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
      from: process.env.EMAIL_FROM,
      sendVerificationRequest
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
        token.teamMember = findUser.teamMember;
        token.memberRole = findUser.memberRole;
      }

      return token;
    },

    session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.teamMember = token.teamMember;
        session.user.memberRole = token.memberRole;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }
