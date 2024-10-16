"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { createTipTapDocument } from "./createTipTapDocument";
import { nanoid } from 'nanoid';

type State = {
  message: string | null;
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
    const tiptapDocId = nanoid(21);
    console.log(`Generated TipTap Doc ID: ${tiptapDocId}`);

    await createTipTapDocument(`${name} - Account Document`, tiptapDocId);
    console.log(`Created TipTap document with ID: ${tiptapDocId}`);

    const account = await prisma.accounts.create({
      data: {
        name,
        industry: industry || null,
        tiptap_doc_id: tiptapDocId,
      },
    });

    console.log(`Created account with ID: ${account.id} and TipTap document ID: ${tiptapDocId}`);

    // Verify that the account was created with the TipTap Doc ID
    const createdAccount = await prisma.accounts.findUnique({
      where: { id: account.id },
    });

    if (!createdAccount || !createdAccount.tiptap_doc_id) {
      console.error(`Account created but TipTap Doc ID is missing. Account ID: ${account.id}`);
      return { message: "Account created but TipTap Doc ID is missing" };
    }

    return { message: null };
  } catch (error) {
    console.error("Error creating account:", error);
    return { message: "Failed to create account" };
  }
}
