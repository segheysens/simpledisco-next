// src/app/actions/getMeeting.ts
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getMeeting(meetingId: string) {
  const { userId }: { userId: string | null } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const user = await prisma.users.findUnique({ where: { idp_id: userId } });

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const meeting = await prisma.meetings.findUnique({
      where: { id: meetingId },
    });

    console.log("************************************");
    console.log("************************************");
    console.log("************************************");
    console.log("************************************");
    console.log("************************************");
    console.log("getMeeting meeting:", meeting);
    console.log("************************************");
    console.log("************************************");
    console.log("************************************");
    console.log("************************************");
    console.log("************************************");

    return meeting;
  } catch (error) {
    console.error("Error fetching meeting:", error);
    throw new Error("Failed to fetch meeting");
  }
}
