"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const Tiptap = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Hello World! 🌎️</p>",
    immediatelyRender: true,
  });

  return (
    <div className="min-h-24 p-2 shadow-xl">
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
