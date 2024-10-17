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
  const [accountData, setAccountData] = useState<any>(null);
  const { userId } = useAuth();

  useEffect(() => {
    async function fetchData() {
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

        if (meeting.account_id) {
          const account = await getAccount(meeting.account_id);
          console.log("Account data:", account);
          setAccountData(account);
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
        setMeetingData(null);
        setAccountData(null);
      }
    }

    fetchData();
  }, [params.meetingId, userId]);

  if (!meetingData || !accountData) {
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
            {accountData.tiptap_internal_doc_id && userId && (
              <BlockEditor
                ydoc={new Y.Doc()}
                provider={new TiptapCollabProvider({
                  appId: process.env.NEXT_PUBLIC_TIPTAP_APP_ID!,
                  name: accountData.tiptap_doc_id,
                  // token: process.env.NEXT_PUBLIC_TIPTAP_AUTH_TOKEN,
                })}
                hasCollab={true}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
