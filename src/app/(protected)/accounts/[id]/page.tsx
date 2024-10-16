"use client";

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { accounts as Account } from "@prisma/client";

export default function AccountDetails() {
  const { id } = useParams();
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    async function fetchAccountDetails() {
      const response = await fetch(`/api/accounts/${id}`);
      if (response.ok) {
        const data = await response.json();
        setAccount(data);
      } else {
        console.error('Failed to fetch account details');
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
      <p><strong>Created at:</strong> {new Date(account.created_at!).toLocaleString()}</p>
    </div>
  );
}
