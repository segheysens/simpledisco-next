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
  const description = formData.get("description") as string;
  const { userId }: { userId: string | null } = auth();

  if (!userId) {
    return { message: "User not authenticated" };
  }

  if (!name || !description) {
    return { message: "Name and description are required" };
  }

  const user = await prisma.users.findUnique({ where: { idp_id: userId } });
  console.info(userId);

  if (!user) {
    return { message: "User not found" };
  }

  try {
    const template = await prisma.discovery_templates.create({
      data: { user_id: user.id, name, description },
    });

    return { message: null, redirect: `/app/templates/${template.id}` };
  } catch (error) {
    console.error("Error creating template:", error);
    return { message: "Failed to create template" };
  }
}
