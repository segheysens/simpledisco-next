// src/app/(protected)/meetings/[meetingId]/page.tsx

"use client";

import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LuCalendar, LuClock, LuVideo, LuUsers } from "react-icons/lu";
import { BlockEditor } from "@/components/BlockEditor";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { getUser } from "@/app/actions/getUser";
import { getAccount } from "@/app/actions/getAccount";
import { getMeeting } from "@/app/actions/getMeeting";
import * as Y from 'yjs';
import { TiptapCollabProvider } from '@hocuspocus/provider';

export default function MeetingPage({
  params,
}: {
  params: { meetingId: string };
}) {
  const [meetingData, setMeetingData] = useState<any>(null);
  const [provider, setProvider] = useState<TiptapCollabProvider | null>(null);
  const [ydoc, setYdoc] = useState<Y.Doc | null>(null);
  const { userId } = useAuth();

  useEffect(() => {
    async function fetchMeetingData() {
      if (!userId) {
        console.error("User ID is not available");
        return;
      }

      try {
        console.log("Fetching meeting data for ID:", params.meetingId);
        const meeting = await getMeeting(params.meetingId);
        console.log("Meeting data:", meeting);

        if (!meeting) {
          console.error("Meeting not found for ID:", params.meetingId);
          setMeetingData(null);
          return;
        }

        setMeetingData(meeting);

        if (!meeting.account_id) {
          console.error("Meeting found, but Account ID is missing. Meeting ID:", meeting.id);
          return;
        }

        console.log("Fetching account data for ID:", meeting.account_id);
        const account = await getAccount(meeting.account_id);
        console.log("Account data:", account);

        if (!account) {
          console.error("Account not found for ID:", meeting.account_id);
          return;
        }

        if (!account.tiptap_doc_id) {
          console.error("Account found, but TipTap Doc ID is missing. Account ID:", account.id);
          // You might want to handle this case, e.g., by creating a new TipTap document
          return;
        }

        console.log("TipTap Doc ID:", account.tiptap_doc_id);
        const newYdoc = new Y.Doc();
        console.log("NEXT_PUBLIC_HOCUSPOCUS_URL:", process.env.NEXT_PUBLIC_HOCUSPOCUS_URL);
        console.log("TipTap Doc ID:", account.tiptap_doc_id);
        console.log("User ID:", userId);

        const hocuspocusUrl = process.env.NEXT_PUBLIC_HOCUSPOCUS_URL;
        if (!hocuspocusUrl) {
          console.error("NEXT_PUBLIC_HOCUSPOCUS_URL is not set");
          throw new Error("Hocuspocus URL is not configured");
        }

        const newProvider = new TiptapCollabProvider({
          appId: process.env.NEXT_PUBLIC_TIPTAP_APP_ID,
          name: account.tiptap_doc_id,
          token: userId,
          document: newYdoc,
        });

        console.log("TiptapCollabProvider config:", newProvider);

        newProvider.on('status', ({ status }) => {
          console.log('Connection status:', status)
        })

        await newProvider.connect();

        console.log("New Y.Doc created:", newYdoc);
        console.log("New TiptapCollabProvider created:", newProvider);

        setYdoc(newYdoc);
        setProvider(newProvider);
      } catch (error) {
        console.error("Error in fetchMeetingData:", error);
        setMeetingData(null);
      }
    }

    fetchMeetingData();

    return () => {
      if (provider) {
        console.log("Destroying provider");
        provider.destroy();
      }
    };
  }, [params.meetingId, userId]);

  if (!meetingData) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="w-full max-w-7xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">
          {meetingData.name} Sales Call
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <LuCalendar className="text-muted-foreground" />
                <span>{new Date(meetingData.scheduled_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-4">
                <LuClock className="text-muted-foreground" />
                <span>
                  {new Date(meetingData.scheduled_at).toLocaleTimeString()} ({meetingData.duration} min)
                </span>
              </div>
            </div>
            <Button className="w-full flex items-center justify-center space-x-2">
              <LuVideo className="w-4 h-4" />
              <span>Join Meeting</span>
            </Button>
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <LuUsers className="w-5 h-5 mr-2" />
                Attendees
              </h3>
              <ul className="space-y-3">
                {meetingData.attendees && meetingData.attendees.map((attendee: any, index: number) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={attendee.avatar} alt={attendee.name} />
                      <AvatarFallback>
                        {attendee.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{attendee.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {attendee.role}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="w-full md:w-2/3 space-y-2">
            {console.log("Render - ydoc:", ydoc, "provider:", provider)}
            {ydoc && provider ? (
              <BlockEditor
                hasCollab={true}
                ydoc={ydoc}
                provider={provider}
              />
            ) : (
              <div>
                {!meetingData ? (
                  "Loading meeting data..."
                ) : !meetingData.account_id ? (
                  "Error: Meeting has no associated account"
                ) : !ydoc || !provider ? (
                  "Error: Failed to initialize collaboration. Check console for details."
                ) : (
                  "Loading editor..."
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
