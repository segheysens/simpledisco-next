// src/app/actions/getMeeting.ts
"use server";

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
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

    return account;
  } catch (error) {
    console.error("Error fetching account:", error);
    throw new Error("Failed to fetch account");
  }
}
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

type State = {
  message: string | null;
  redirect?: string;
};

export async function createAccount(
  prevState: State,
  formData: FormData
): Promise<State> {
  const name = formData.get("name") as string;
  const industry = formData.get("industry") as string;
  const { userId }: { userId: string | null } = auth();

  if (!userId) {
    return { message: "User not authenticated" };
  }

  if (!name) {
    return { message: "Name is required" };
  }

  const user = await prisma.users.findUnique({ where: { idp_id: userId } });

  if (!user) {
    return { message: "User not found" };
  }

  try {
    const account = await prisma.accounts.create({
      data: {
        name,
        industry: industry || null,
      },
    });

    return { message: null, redirect: `/accounts/${account.id}` };
  } catch (error) {
    console.error("Error creating account:", error);
    return { message: "Failed to create account" };
  }
}
