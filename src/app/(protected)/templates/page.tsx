"use client";
import { createTemplate } from "@/app/actions/createTemplate";
import { getTemplates } from "@/app/actions/getTemplates";
import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type State = {
  message: string | null;
};

const initialState: State = {
  message: null,
};

interface Template {
  id: string;
  name: string;
  // Add other relevant fields from your schema
}

export default function Templates() {
  const [state, formAction] = useFormState<State, FormData>(
    createTemplate,
    initialState
  );
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    async function fetchTemplates() {
      const allTemplates = await getTemplates();
      setTemplates(allTemplates);
    }

    fetchTemplates();
  }, []);

  return (
    <div className="h-full w-full flex flex-col sm:flex-row">
      <div className="h-full w-full sm:w-1/3 flex flex-col justify-center">
        <h1 className="text-3xl font-bold">Templates</h1>
        <h2 className="text-sm font-semibold">All Templates</h2>
        <ul className="space-y-4">
          {templates.map((template) => (
            <li key={template.id}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{template.name}</h3>
                </div>
                <Button variant="outline">View</Button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="h-full w-full sm:w-2/3 flex flex-col justify-center">
        <form
          action={formAction}
          className="space-y-4 flex flex-col justify-center items-center"
        >
          <Card>
            <CardHeader className="flex flex-col space-y-1.5 p-6">
              <CardTitle className="font-semibold leading-none tracking-tight">
                Create New Template
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Make a discovery template to use in meetings
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
                    placeholder="e.g. 'MEDDPICC Discovery'"
                    required
                  />
                </fieldset>
                <Button type="submit">Create Template</Button>
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
