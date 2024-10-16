// src/app/(protected)/meetings/page.tsx

"use client";
import { createMeeting } from "@/app/actions/createMeeting";
import { getMeetings } from "@/app/actions/getMeetings";
import { useFormState } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { meetings as Meeting } from "@prisma/client";

type State = {
  message: string | null;
};

const initialState: State = {
  message: null,
};

export default function Meetings() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState<State, FormData>(
    async (prevState, formData) => {
      await createMeeting(prevState, formData);
      setReloadMeetings(true);
      return { message: null };
    },
    initialState
  );
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  const [recentMeetings, setRecentMeetings] = useState<Meeting[]>([]);
  const [reloadMeetings, setReloadMeetings] = useState<boolean>(false);

  useEffect(() => {
    async function fetchMeetings() {
      const allMeetings = await getMeetings();
      // console.log("allMeetings:");
      // console.log(allMeetings);
      const now = new Date();

      const upcoming = allMeetings
        .filter((meeting) => new Date(meeting.scheduled_at) > now)
        .sort(
          (a, b) =>
            new Date(a.scheduled_at).getTime() -
            new Date(b.scheduled_at).getTime()
        );

      const recent = allMeetings
        .filter((meeting) => new Date(meeting.scheduled_at) <= now)
        .sort(
          (a, b) =>
            new Date(b.scheduled_at).getTime() -
            new Date(a.scheduled_at).getTime()
        );

      setUpcomingMeetings(upcoming);
      setRecentMeetings(recent);
      setReloadMeetings(false);
    }

    fetchMeetings();
  }, [reloadMeetings]);

  function handleReloadMeetings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    formAction(new FormData(event.currentTarget));
    setReloadMeetings(true);
    if (formRef.current) {
      formRef.current.reset();
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  return (
    <div className="h-full w-full flex flex-col sm:flex-row">
      <div className="h-full w-full sm:w-1/3 flex flex-col justify-center">
        <h1 className="text-3xl font-bold">Meetings</h1>
        {/*  List of upcoming meetings */}
        <h2 className="text-sm font-semibold">Upcoming Meetings</h2>
        <ul className="space-y-4">
          {upcomingMeetings.map((meeting) => (
            <li key={meeting.id} className="hover:bg-gray-50 rounded p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{meeting.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(meeting.scheduled_at).toLocaleDateString()} at{" "}
                    {new Date(meeting.scheduled_at).toLocaleTimeString()}
                  </p>
                </div>
                <Button variant="outline">Join</Button>
              </div>
            </li>
          ))}
        </ul>

        {/*  List of recent meetings */}
        <h2 className="text-sm font-semibold">Recent Meetings</h2>
        <ul className="space-y-4">
          {recentMeetings.map((meeting) => (
            <li key={meeting.id}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{meeting.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(meeting.scheduled_at).toLocaleDateString()} at{" "}
                    {new Date(meeting.scheduled_at).toLocaleTimeString()}
                  </p>
                </div>
                <Link href={`/meetings/${meeting.id}`}>
                  <Button variant="outline">View</Button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="h-full w-full sm:w-2/3 flex flex-col justify-center">
        <form
          ref={formRef}
          action={formAction}
          onSubmit={handleReloadMeetings}
          onKeyDown={handleKeyDown}
          className="space-y-4 flex flex-col justify-center items-center"
        >
          <Card>
            <CardHeader className="flex flex-col space-y-1.5 p-6">
              <CardTitle className="font-semibold leading-none tracking-tight">
                Create New Meeting
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Make a discovery meeting to use in meetings
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 h-full">
              <div className="grid w-full items-center gap-4">
                <fieldset className="flex flex-col space-y-1.5">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="e.g. 'Customer Co. - Workflow Mapping'"
                    required
                  />
                </fieldset>
                <Button type="submit">Create Meeting</Button>
                {state.message && (
                  <p className="text-red-500">{state.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
