// src/app/actions/createMeeting.ts
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

type State = {
  message: string | null;
  redirect?: string;
};

export async function createMeeting(
  prevState: State,
  formData: FormData
): Promise<State> {
  const name = formData.get("name") as string;
  const accountId = formData.get("account_id") as string;
  const { userId }: { userId: string | null } = auth();

  if (!userId) {
    return { message: "User not authenticated" };
  }

  if (!name) {
    return { message: "Name is required" };
  }

  if (!accountId) {
    return { message: "Account is required" };
  }

  const user = await prisma.users.findUnique({ where: { idp_id: userId } });
  console.info(userId);

  if (!user) {
    return { message: "User not found" };
  }

  try {
    const meeting = await prisma.meetings.create({
      data: { 
        user_id: user.id, 
        name: name,
        account_id: accountId
      },
    });

    return { message: null, redirect: `/app/meetings/${meeting.id}` };
  } catch (error) {
    console.error("Error creating meeting:", error);
    return { message: "Failed to create meeting" };
  }
}
