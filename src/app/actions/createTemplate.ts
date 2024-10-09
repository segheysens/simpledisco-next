"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

type State = {
  message: string | null;
  redirect?: string;
};

export async function createTemplate(
  prevState: State,
  formData: FormData
): Promise<State> {
  const name = formData.get("name") as string;
  const content = formData.get("content") as string;
  const { userId }: { userId: string | null } = auth();

  if (!userId) {
    return { message: "User not authenticated" };
  }

  if (!name || !content) {
    return { message: "Name and content are required" };
  }

  const user = await prisma.users.findUnique({ where: { idp_id: userId } });
  console.info(userId);

  if (!user) {
    return { message: "User not found" };
  }

  try {
    const template = await prisma.discovery_templates.create({
      data: { user_id: user.id, name, content },
    });

    return { message: null, redirect: `/app/templates/${template.id}` };
  } catch (error) {
    console.error("Error creating template:", error);
    return { message: "Failed to create template" };
  }
}
