// src/app/actions/getaccount.ts
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getAccount(accountId: string) {
  const { userId }: { userId: string | null } = auth();

  if (!userId) {
    console.error("User not authenticated");
    throw new Error("User not authenticated");
  }

  try {
    const user = await prisma.users.findUnique({ where: { idp_id: userId } });

    if (!user) {
      console.error("User not found");
      throw new Error("User not found");
    }

    console.log(`Attempting to fetch account with ID: ${accountId}`);
    const account = await prisma.accounts.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      console.log(`Account not found for ID: ${accountId}`);
      return null;
    }

    console.log(`Successfully fetched account with ID: ${accountId}`);
    console.log("Account data:", account);

    return account;
  } catch (error) {
    console.error(`Error fetching account with ID ${accountId}:`, error);
    throw error; // Re-throw the error to be caught in the component
  }
}
