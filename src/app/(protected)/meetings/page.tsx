"use client";
import { createMeeting } from "@/app/actions/createMeeting";

// import { Form } from "@remix-run/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import prisma from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * 
 * 
 * Unhandled Runtime Error
Error: Hydration failed because the initial UI does not match what was rendered on the server.
See more info here: https://nextjs.org/docs/messages/react-hydration-error

Expected server HTML to contain a matching <div> in <header 
 * 
 * 
 */

export default function Meetings() {
  return (
    <form
      action={createMeeting}
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
        <CardContent className="p-6 pt-0">
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
                placeholder="e.g. 'SMB Discovery'"
                required
              />
            </fieldset>
            <Button type="submit">Create Meeting</Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
