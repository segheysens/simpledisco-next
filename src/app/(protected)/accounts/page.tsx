"use client";
import { createAccount } from "@/app/actions/createAccount";
import { getAccounts } from "@/app/actions/getAccounts";
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
import { accounts as Account } from "@prisma/client";

type State = {
  message: string | null;
};

const initialState: State = {
  message: null,
};

export default function Accounts() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState<State, FormData>(
    async (prevState, formData) => {
      const result = await createAccount(prevState, formData);
      setReloadAccounts(true);
      return result;
    },
    initialState
  );
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [reloadAccounts, setReloadAccounts] = useState<boolean>(false);

  useEffect(() => {
    async function fetchAccounts() {
      const allAccounts = await getAccounts();
      setAccounts(allAccounts);
      setReloadAccounts(false);
    }

    fetchAccounts();
  }, [reloadAccounts]);

  function handleReloadAccounts(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    formAction(new FormData(event.currentTarget));
    setReloadAccounts(true);
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
      <div className="h-full w-full sm:w-1/2 flex flex-col justify-center">
        <h1 className="text-3xl font-bold mb-4">Accounts</h1>
        <ul className="space-y-4">
          {accounts.map((account) => (
            <li key={account.id} className="hover:bg-gray-50 rounded p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{account.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {account.industry || "No industry specified"}
                  </p>
                </div>
                <Link href={`/accounts/${account.id}`}>
                  <Button variant="outline">View</Button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="h-full w-full sm:w-1/2 flex flex-col justify-center">
        <form
          ref={formRef}
          action={formAction}
          onSubmit={handleReloadAccounts}
          onKeyDown={handleKeyDown}
          className="space-y-4 flex flex-col justify-center items-center"
        >
          <Card>
            <CardHeader className="flex flex-col space-y-1.5 p-6">
              <CardTitle className="font-semibold leading-none tracking-tight">
                Create New Account
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Add a new account to your list
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
                    placeholder="e.g. 'Acme Corporation'"
                    required
                  />
                </fieldset>
                <fieldset className="flex flex-col space-y-1.5">
                  <label
                    htmlFor="industry"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Industry
                  </label>
                  <Input
                    type="text"
                    id="industry"
                    name="industry"
                    placeholder="e.g. 'Technology'"
                  />
                </fieldset>
                <Button type="submit">Create Account</Button>
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
