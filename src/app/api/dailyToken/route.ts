import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const API_SECRET = process.env.NEXT_PUBLIC_DAILY_API_KEY;

export async function POST(request: Request) {
  const { roomName } = await request.json();
  console.log("server hit");

  if (!roomName) {
    return NextResponse.json(
      { error: "Room name is required" },
      { status: 400 }
    );
  }

  if (!API_SECRET) {
    return NextResponse.json(
      { error: "API secret is not set" },
      { status: 500 }
    );
  }

  const now = Math.floor(Date.now() / 1000);
  const exp = now + 60 * 60; // Token expires in 1 hour

  const payload = {
    r: roomName,
    d: process.env.DAILY_DOMAIN_ID,
    o: true, // is_owner
    iat: now,
    exp: exp,
    ast: true, // auto_start_transcription
    p: {
      // permissions
      canAdmin: "transcription",
    },
  };

  try {
    const token = jwt.sign(payload, API_SECRET);
    return NextResponse.json({ token });
  } catch (error) {
    console.error("Error creating token:", error);
    return NextResponse.json(
      { error: "Failed to create token" },
      { status: 500 }
    );
  }
}
