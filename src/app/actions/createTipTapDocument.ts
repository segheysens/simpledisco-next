"use server";

import axios from 'axios';

export async function createTipTapDocument(name: string): Promise<string> {
  try {
    const response = await axios.post('https://api.tiptap.dev/v1/documents', {
      name: name,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.TIPTAP_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data.id;
  } catch (error) {
    console.error('Error creating TipTap document:', error);
    throw new Error('Failed to create TipTap document');
  }
}
