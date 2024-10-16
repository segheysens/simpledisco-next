"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { createTipTapDocument } from "./createTipTapDocument";

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
    const tiptapDocId = await createTipTapDocument(`${name} - Account Document`);

    const account = await prisma.accounts.create({
      data: {
        name,
        industry: industry || null,
        tiptap_doc_id: tiptapDocId,
      },
    });

    console.log(`Created account with TipTap document ID: ${tiptapDocId}`);

    return { message: null };
  } catch (error) {
    console.error("Error creating account:", error);
    return { message: "Failed to create account" };
  }
}
