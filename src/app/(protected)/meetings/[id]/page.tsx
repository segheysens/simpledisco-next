/**
 * Template -
 * --> Name: MEDPIC MM CREDIT UNION
 * --> Content: Markdown Blob
 * --> Discovery questions: combination of user supplied and auto-generated
 * People of interest
 *
 */
"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LuCalendar, LuClock, LuVideo, LuUsers } from "react-icons/lu";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
} from "@lexical/markdown";
import { $getRoot } from "lexical";

function getMeetingData(meetingId: string) {
  // In a real application, you would fetch this data from an API or database
  // For now, we'll return mock data
  const mockData = {
    customerName: "Acme Corp",
    date: "2024-10-15",
    time: "14:00",
    duration: "60",
    meetingLink: "https://meet.example.com/acme-call",
    attendees: [
      {
        name: "John Doe",
        role: "Sales Rep",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        name: "Jane Smith",
        role: "Product Specialist",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        name: "Bob Johnson",
        role: "Customer",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        name: "Alice Brown",
        role: "Customer",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
    prepDoc: `
# Acme Corp Sales Call Preparation

## Agenda
1. Introduction (5 minutes)
2. Product Demo (20 minutes)
3. Q&A Session (25 minutes)
4. Next Steps (10 minutes)

## Key Points
- Highlight new features in our latest release
- Address their concerns about scalability
- Discuss potential integration with their existing systems

## Customer Background
Acme Corp is a medium-sized business looking to upgrade their CRM system. They've been using a competitor's product for the past 3 years but are dissatisfied with the lack of customization options.

## Action Items
- [ ] Prepare demo environment with Acme Corp's sample data
- [ ] Review previous meeting notes
- [ ] Prepare responses to expected objections
    `,
  };

  return mockData;
}

function LexicalEditor({
  initialContent,
  onContentChange,
}: {
  initialContent: string;
  onContentChange: (content: string) => void;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      const root = $getRoot();
      root.clear();
      const parsed = $convertFromMarkdownString(initialContent);
      root.append(...parsed);
    });
  }, [editor, initialContent]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const markdown = $convertToMarkdownString();
        onContentChange(markdown);
      });
    });
  }, [editor, onContentChange]);

  return null;
}

export default function MeetingPage({
  params,
}: {
  params: { meetingId: string };
}) {
  const meetingData = getMeetingData(params.meetingId);
  const [content, setContent] = useState(meetingData?.prepDoc || "");
  const [isEditing, setIsEditing] = useState(false);

  if (!meetingData) {
    notFound();
  }

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const initialConfig = {
    namespace: "MeetingPreparationEditor",
    onError: (error: Error) => console.error(error),
  };

  return (
    <Card className="w-full max-w-7xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">
          {meetingData.customerName} Sales Call
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
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Preparation Document</h3>
              <Button onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? "View" : "Edit"}
              </Button>
            </div>
            {isEditing ? (
              <LexicalComposer initialConfig={initialConfig}>
                <div className="relative">
                  <RichTextPlugin
                    contentEditable={
                      <ContentEditable className="min-h-[300px] border p-4" />
                    }
                    placeholder={
                      <div className="absolute top-[15px] left-[15px] text-gray-400">
                        Enter your prep notes here...
                      </div>
                    }
                  />
                  <HistoryPlugin />
                  <AutoFocusPlugin />
                  <MarkdownShortcutPlugin />
                  <LexicalEditor
                    initialContent={content}
                    onContentChange={handleContentChange}
                  />
                </div>
              </LexicalComposer>
            ) : (
              <div
                className="prose max-w-none border p-4 min-h-[300px]"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
