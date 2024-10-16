"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getMeeting(meetingId: string) {
  const { userId }: { userId: string | null } = auth();

  if (!userId) {
    console.error("User not authenticated");
    throw new Error("User not authenticated");
  }

  try {
    console.log(`Attempting to fetch meeting with ID: ${meetingId}`);
    const meeting = await prisma.meetings.findUnique({
      where: { id: meetingId },
      include: {
        contacts: true,
        companies: true,
      },
    });

    if (!meeting) {
      console.log(`Meeting not found for ID: ${meetingId}`);
      return null;
    }

    console.log(`Successfully fetched meeting with ID: ${meetingId}`);
    return meeting;
  } catch (error) {
    console.error(`Error fetching meeting with ID ${meetingId}:`, error);
    throw error; // Re-throw the error to be caught in the component
  }
}
