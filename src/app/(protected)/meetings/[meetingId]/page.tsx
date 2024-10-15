// src/app/(protected)/meetings/[meetingId]/page.tsx

"use client";

// import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import Tiptap from "@/components/TipTap";
import { LuCalendar, LuClock, LuVideo, LuUsers } from "react-icons/lu";
// import { getMeeting } from "@/app/actions/getMeeting";
import { BlockEditor } from "@/components/BlockEditor";
import { Doc as YDoc } from "yjs";
import { TiptapCollabProvider } from "@hocuspocus/provider";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { getUser } from "@/app/actions/getUser";
import { getAccount } from "@/app/actions/geAccount";

function getMeetingData(meetingId: string) {
  console.log("meetingData:");
  console.log(meetingId);

  // const meetingData = getMeeting(meetingId);

  return { name: "test", attendees: [] };
}

export default function MeetingPage({
  params,
}: {
  params: { meetingId: string };
}) {
  console.log("params.meetingId:");
  const meetingData = getMeetingData(params.meetingId);
  const [provider, setProvider] = useState<TiptapCollabProvider>();
  // const [docID, setDocID] = useEffect<string>();
  const [document, setDocument] = useState<YDoc>();
  // const {userId} = useAuth();

  // const [content, setContent] = useState(meetingData?.prepDoc || "");
  // const [isEditing, setIsEditing] = useState(false);

  if (!meetingData) {
    notFound();
  }

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await fetch(
          `https://${process.env.TIPTAP_APP_ID}.collab.tiptap.cloud/api/documents/${meetingData.tiptap_doc_id}?format=yjs`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${process.env.TIPTAP_AUTH_TOKEN}`,
              // Add any necessary authentication headers here
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setDocument(data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchDocument();
  }, [meetingData]);

  useEffect(() => {
    // example Ydoc for starting the provider:
    // const doc = new YDoc();

    setProvider(
      new TiptapCollabProvider({
        name: "23983298233", // Document identifier
        appId: process.env.TIPTAP_APP_ID, // replace with YOUR_APP_ID from Cloud dashboard
        token: "YOUR_JWT", // Authentication token
        document: document,
      })
    );
  }, [document]);

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
                <span>{meetingData.date}</span>
              </div>
              <div className="flex items-center space-x-4">
                <LuClock className="text-muted-foreground" />
                <span>
                  {meetingData.time} ({meetingData.duration} min)
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
                {meetingData.attendees.map((attendee, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={attendee.avatar} alt={attendee.name} />
                      <AvatarFallback>
                        {attendee.name
                          .split(" ")
                          .map((n) => n[0])
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
            {/* <Tiptap /> */}
            <BlockEditor
              hasCollab={false}
              ydoc={new YDoc()}
              provider={undefined}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
