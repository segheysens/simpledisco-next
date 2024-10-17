"use server";

import * as Y from 'yjs';

export async function createTipTapDocuments(name: string, internalDocId: string, externalDocId: string): Promise<string> {
  try {
    const createDocument = async (docId: string, isInternal: boolean) => {
      // Create a new Yjs document
      const ydoc = new Y.Doc();

      // Add initial content to the document
      const ytext = ydoc.getText('content');
      ytext.insert(0, `Welcome to the ${isInternal ? 'internal' : 'external'} account document for ${name}!`);

      // Convert the Yjs document to binary data
      const binaryData = Y.encodeStateAsUpdate(ydoc);

      const url = `https://${process.env.NEXT_PUBLIC_TIPTAP_APP_ID}.collab.tiptap.cloud/api/documents/${docId}`;

      console.log(`Creating ${isInternal ? 'internal' : 'external'} document:`, url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `${process.env.NEXT_PUBLIC_TIPTAP_AUTH_TOKEN}`,
          'Content-Type': 'application/octet-stream',
        },
        body: binaryData,
      });


      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
      }

      console.log(`TipTap ${isInternal ? 'internal' : 'external'} document created with ID: ${docId}`);
    };

    // Create both documents in parallel
    await Promise.all([
      createDocument(internalDocId, true),
      createDocument(externalDocId, false)
    ]);
    console.log('Both internal and external TipTap documents created successfully');
    return "success"
  } catch (error) {
    console.error('Error creating TipTap documents:', error);
    throw new Error(`Failed to create TipTap documents: ${error}`);
  }
}