"use client";

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { accounts as Account } from "@prisma/client";
import { getAccounts } from "@/app/actions/getAccounts";

export default function AccountDetails() {
  const { id } = useParams();
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    async function fetchAccountDetails() {
      const accounts = await getAccounts();
      const foundAccount = accounts.find(acc => acc.id === id);
      if (foundAccount) {
        setAccount(foundAccount);
      } else {
        console.error('Account not found');
      }
    }

    fetchAccountDetails();
  }, [id]);

  if (!account) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{account.name}</h1>
      <p><strong>Industry:</strong> {account.industry || 'Not specified'}</p>
      <p><strong>Size:</strong> {account.size || 'Not specified'}</p>
      <p><strong>Created at:</strong> {account.created_at ? new Date(account.created_at).toLocaleString() : 'Not specified'}</p>
    </div>
  );
}
