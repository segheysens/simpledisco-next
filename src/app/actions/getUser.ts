// src/app/actions/getuser.ts
"use server";

import prisma from "@/lib/prisma";

export async function getUser(userId: string) {
  const user = await prisma.users.findUnique({ where: { idp_id: userId } });

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user");
  }
}
