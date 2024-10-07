"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getTemplates() {
  const { userId }: { userId: string | null } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const user = await prisma.users.findUnique({ where: { idp_id: userId } });

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const templates = await prisma.discovery_templates.findMany({
      where: { user_id: user.id },
      orderBy: { created_at: "desc" },
    });

    return templates;
  } catch (error) {
    console.error("Error fetching templates:", error);
    throw new Error("Failed to fetch templates");
  }
}
