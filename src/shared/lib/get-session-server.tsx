"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/src/db";
import { eq } from "drizzle-orm";
import { user } from "@/src/db/schema";
import { getServerSession } from "next-auth";

export async function getUserSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return undefined;
const  userSession  = await db.select().from(user).where(eq(user.id,session.user.id))
  return userSession[0];
}
