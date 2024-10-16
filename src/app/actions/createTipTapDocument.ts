"use server";

export async function createTipTapDocument(name: string, accountId: string): Promise<string> {
  try {
    const response = await fetch('https://api.tiptap.dev/v1/documents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TIPTAP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        content: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: `Welcome to the account document for ${name}!` }
              ]
            }
          ]
        },
        metadata: {
          accountId: accountId
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
    }

    const data = await response.json();
    return data.document.id;
  } catch (error) {
    console.error('Error creating TipTap document:', error);
    throw new Error('Failed to create TipTap document');
  }
}
