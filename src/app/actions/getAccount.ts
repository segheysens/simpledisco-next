// src/app/actions/getaccount.ts
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getAccount(accountId: string) {
  const { userId }: { userId: string | null } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const user = await prisma.users.findUnique({ where: { idp_id: userId } });

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const account = await prisma.accounts.findUnique({
      where: { id: accountId },
    });

    console.log("************************************");
    console.log("************************************");
    console.log("************************************");
    console.log("************************************");
    console.log("************************************");
    console.log("getAccount Account:", account);
    console.log("************************************");
    console.log("************************************");
    console.log("************************************");
    console.log("************************************");
    console.log("************************************");

    return account;
  } catch (error) {
    console.error("Error fetching account:", error);
    throw new Error("Failed to fetch account");
  }
}
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getAccount(accountId: string) {
  const { userId }: { userId: string | null } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    const account = await prisma.accounts.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new Error("Account not found");
    }

    return account;
  } catch (error) {
    console.error("Error fetching account:", error);
    throw new Error("Failed to fetch account");
  }
}
