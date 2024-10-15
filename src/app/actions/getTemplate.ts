// src/app/actions/getTemplate.ts
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getTemplate(templateId: string) {
  const { userId }: { userId: string | null } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const user = await prisma.users.findUnique({ where: { idp_id: userId } });

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const template = await prisma.templates.findUnique({
      where: { id: templateId },
    });

    console.log("************************************");
    console.log("************************************");
    console.log("************************************");
    console.log("************************************");
    console.log("************************************");
    console.log("getTemplate template:", template);
    console.log("************************************");
    console.log("************************************");
    console.log("************************************");
    console.log("************************************");
    console.log("************************************");

    return template;
  } catch (error) {
    console.error("Error fetching template:", error);
    throw new Error("Failed to fetch template");
  }
}
