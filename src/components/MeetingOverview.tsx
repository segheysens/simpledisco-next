"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, ClockIcon, UsersIcon, VideoIcon } from "lucide-react";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema, DOMParser } from "prosemirror-model";
import { schema } from "prosemirror-markdown";
import { addListNodes } from "prosemirror-schema-list";
import { exampleSetup } from "prosemirror-example-setup";
import markdownit from "markdown-it";

interface MeetingOverviewProps {
  customerName: string;
  date: string;
  time: string;
  duration: string;
  meetingLink: string;
  attendees: Array<{ name: string; role: string; avatar: string }>;
  prepDoc: string;
}

export default function MeetingOverview({
  customerName,
  date,
  time,
  duration,
  meetingLink,
  attendees,
  prepDoc,
}: MeetingOverviewProps) {
  const [editorView, setEditorView] = useState<EditorView | null>(null);

  useEffect(() => {
    if (!editorView) {
      const md = markdownit();
      const mySchema = new Schema({
        nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
        marks: schema.spec.marks,
      });

      const contentElement = document.createElement("div");
      contentElement.innerHTML = md.render(prepDoc);

      const state = EditorState.create({
        doc: DOMParser.fromSchema(mySchema).parse(contentElement),
        plugins: exampleSetup({ schema: mySchema }),
      });

      const view = new EditorView(document.querySelector("#editor"), {
        state,
        editable: () => false,
      });

      setEditorView(view);
    }

    return () => {
      if (editorView) {
        editorView.destroy();
      }
    };
  }, [editorView, prepDoc]);

  return (
    <Card className="w-full max-w-7xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{customerName} Sales Call</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <CalendarIcon className="text-muted-foreground" />
                <span>{date}</span>
              </div>
              <div className="flex items-center space-x-4">
                <ClockIcon className="text-muted-foreground" />
                <span>
                  {time} ({duration} min)
                </span>
              </div>
            </div>
            <Button className="w-full flex items-center justify-center space-x-2">
              <VideoIcon className="w-4 h-4" />
              <span>Join Meeting</span>
            </Button>
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <UsersIcon className="w-5 h-5 mr-2" />
                Attendees
              </h3>
              <ul className="space-y-3">
                {attendees.map((attendee, index) => (
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
            <h3 className="text-lg font-semibold">Preparation Document</h3>
            <div id="editor" className="prose max-w-none" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
