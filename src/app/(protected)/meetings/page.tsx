"use client";
import { createMeeting } from "@/app/actions/createMeeting";
import { useFormState } from 'react-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const initialState = {
  message: null,
};

export default function Meetings() {
  const [state, formAction] = useFormState(createMeeting, initialState);

  return (
    <form
      action={formAction}
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
            {state.message && (
              <p className="text-red-500">{state.message}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
