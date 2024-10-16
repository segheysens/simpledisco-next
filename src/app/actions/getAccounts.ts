"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getAccounts() {
  const { userId }: { userId: string | null } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    const accounts = await prisma.accounts.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });

    return accounts;
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw new Error("Failed to fetch accounts");
  }
}
