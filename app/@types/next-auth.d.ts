// Ref: https://next-auth.js.org/getting-started/typescript#module-augmentation

import { DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import type { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      firstName: string;
      lastName: string;
      surName: string;
      email: string;
      organisation: string;
      role: string;
      testPassed: boolean;
      startTest: string;
      passedDate: string;
      testsResult: string;
      okAnswers: number;
      emailVerified: Date | null;
    };
  }

  interface User extends DefaultUser {
    id: number;
    firstName: string;
    lastName: string;
    surName: string;
    email: string;
    organisation: string;
    role: string;
    testPassed: boolean;
    startTest: string;
    passedDate: string;
    testsResult: string;
    okAnswers: number;
    emailVerified: Date | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: number;
    role: UserRole;
  }
}
