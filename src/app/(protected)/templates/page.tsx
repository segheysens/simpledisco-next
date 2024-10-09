"use client";
import { createTemplate } from "@/app/actions/createTemplate";
import { getTemplates } from "@/app/actions/getTemplates";
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

import { discovery_templates as Template } from "@prisma/client";

type State = {
  message: string | null;
};

const initialState: State = {
  message: null,
};

export default function Templates() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState<State, FormData>(
    createTemplate,
    initialState
  );
  const [templates, setTemplates] = useState<Template[]>([]);
  const [reloadTemplates, setReloadTemplates] = useState<boolean>(false);

  useEffect(() => {
    async function fetchTemplates() {
      const allTemplates = await getTemplates();
      setTemplates(allTemplates);
    }

    fetchTemplates();
  }, [reloadTemplates]);

  function handleReloadTemplates(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    formAction(new FormData(event.currentTarget));
    setReloadTemplates(true);
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
        <h1 className="text-3xl font-bold mb-4">Templates</h1>
        <ul className="space-y-2">
          {templates.map((template) => (
            <li key={template.id} className="hover:bg-gray-50 rounded p-4">
              <HoverCard>
                <HoverCardTrigger>
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-col">
                      <h3 className="text-lg font-semibold cursor-pointer">
                        {template.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {template.updated_at && (
                          <>
                            last updated{" "}
                            {template.updated_at.toLocaleDateString()}
                          </>
                        )}
                      </p>
                    </div>

                    <Link href={`/templates/${template.id}/edit`}>
                      <Button variant="outline">Edit</Button>
                    </Link>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <ReactMarkdown className="markdown-content">
                    {template.content}
                  </ReactMarkdown>
                </HoverCardContent>
              </HoverCard>
            </li>
          ))}
        </ul>
      </div>

      <div className="h-full w-full sm:w-2/3 flex flex-col justify-center">
        <form
          ref={formRef}
          action={formAction}
          onSubmit={handleReloadTemplates}
          onKeyDown={handleKeyDown}
          className="space-y-4 flex flex-col justify-center items-center"
        >
          <Card>
            <CardHeader className="flex flex-col space-y-1.5 p-6">
              <CardTitle className="font-semibold leading-none tracking-tight">
                Create New Template
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Make a discovery template to use in Templates
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
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Content
                  </label>
                  <Input
                    type="text"
                    id="content"
                    name="content"
                    placeholder="Make your own BANT, MEDDPICC, or other template here"
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
