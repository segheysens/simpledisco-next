"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { createTipTapDocuments } from "./createTipTapDocuments";
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

  try {
    const user = await prisma.users.findUnique({ where: { idp_id: userId } });

    if (!user) {
      return { message: "User not found" };
    }

    const tiptapInternalDocId = nanoid(21);
    const tiptapExternalDocId = nanoid(21);

    console.log(`Creating TipTap documents for account: ${name}`);
    
    await createTipTapDocuments(`${name} - Account Document`, tiptapInternalDocId, tiptapExternalDocId);

    // Use a transaction to ensure both operations succeed or fail together
    const result = await prisma.accounts.create({
      data: {
        name,
        industry: industry || null,
        tiptap_internal_doc_id: tiptapInternalDocId,
        tiptap_external_doc_id: tiptapExternalDocId
      },
    });

    console.log(`Transaction completed. Verifying account creation.`);

    // Verify that the account was created with the TipTap Doc ID
    const createdAccount = await prisma.accounts.findUnique({
      where: { id: result.id },
    });

    if (!createdAccount || !createdAccount.tiptap_internal_doc_id || !createdAccount.tiptap_external_doc_id) {
      console.error(`Account created but TipTap Doc ID is missing. Account ID: ${result.id}`);
      return { message: "Account created but TipTap Doc ID is missing" };
    }

    console.log(`Account creation verified. Account ID: ${result.id}`);

    return { message: null };
  } catch (error) {
    console.error("Error creating account:", error);
    return { message: `Failed to create account: ${error instanceof Error ? error.message : String(error)}` };
  }
}