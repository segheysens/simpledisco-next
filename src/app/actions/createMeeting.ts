"use server";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function createMeeting(formData: FormData) {
  const name = formData.get("name") as string;
  const { userId }: { userId: string | null } = auth();

  if (!userId) return;

  if (!name) {
    throw new Error("Name is required");
  }

  const user = await prisma.users.findUnique({ where: { idp_id: userId } });

  if (!user) {
    return;
  }

  console.log("look at me!")

  const meeting = await prisma.meetings.create({
    data: { user_id: user.id },
  });

  redirect(`/app/meetings/${meeting.id}`);
}
