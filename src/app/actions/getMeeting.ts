"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getMeeting(meetingId: string) {
  const { userId }: { userId: string | null } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    const meeting = await prisma.meetings.findUnique({
      where: { id: meetingId },
      include: {
        contacts: true,
        companies: true,
      },
    });

    if (!meeting) {
      throw new Error("Meeting not found");
    }

    return meeting;
  } catch (error) {
    console.error("Error fetching meeting:", error);
    throw new Error("Failed to fetch meeting");
  }
}
