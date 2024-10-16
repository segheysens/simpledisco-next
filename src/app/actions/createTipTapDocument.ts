"use server";

export async function createTipTapDocument(name: string, tiptapDocId: string): Promise<void> {
  try {
    const response = await fetch(`https://api.tiptap.dev/v1/documents/${tiptapDocId}`, {
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
          accountId: tiptapDocId
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
    }

    console.log(`TipTap document created with ID: ${tiptapDocId}`);
  } catch (error) {
    console.error('Error creating TipTap document:', error);
    throw new Error('Failed to create TipTap document');
  }
}
