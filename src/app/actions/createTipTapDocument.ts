"use server";

export async function createTipTapDocument(name: string): Promise<string> {
  try {
    const response = await fetch('https://api.tiptap.dev/v1/documents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TIPTAP_AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: name }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error creating TipTap document:', error);
    throw new Error('Failed to create TipTap document');
  }
}
