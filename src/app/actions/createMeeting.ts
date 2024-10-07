"use server";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

type State = {
  message: string | null;
};

export async function createMeeting(prevState: State, formData: FormData): Promise<State> {
  const name = formData.get("name") as string;
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
    const meeting = await prisma.meetings.create({
      data: { user_id: user.id, name: name },
    });

    redirect(`/app/meetings/${meeting.id}`);
  } catch (error) {
    console.error("Error creating meeting:", error);
    return { message: "Failed to create meeting" };
  }
}
