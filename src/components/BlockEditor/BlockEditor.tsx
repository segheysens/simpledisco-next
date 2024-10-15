import { EditorContent } from "@tiptap/react";
import React, { useRef } from "react";

import { LinkMenu } from "@/components/menus";

import { useBlockEditor } from "@/hooks/useBlockEditor";

import "@/tiptap-styles/index.css";

import { ColumnsMenu } from "@/tiptap-extensions/MultiColumn/menus";
import { TableColumnMenu, TableRowMenu } from "@/tiptap-extensions/Table/menus";
import { EditorHeader } from "./components/EditorHeader";
import { TextMenu } from "../menus/TextMenu";
import { ContentItemMenu } from "../menus/ContentItemMenu";
import * as Y from "yjs";
import { TiptapCollabProvider } from "@hocuspocus/provider";

export const BlockEditor = ({
  ydoc,
  provider,
}: {
  hasCollab: boolean;
  ydoc: Y.Doc;
  provider?: TiptapCollabProvider | null | undefined;
}) => {
  const menuContainerRef = useRef(null);

  const { editor, users, collabState } = useBlockEditor({
    ydoc,
    provider,
  });

  if (!editor || !users) {
    return null;
  }

  return (
    <div className="flex h-screen" ref={menuContainerRef}>
      <div className="relative flex flex-col flex-1 h-full overflow-hidden">
        <EditorHeader editor={editor} collabState={collabState} users={users} />
        <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
        <ContentItemMenu editor={editor} />
        <LinkMenu editor={editor} appendTo={menuContainerRef} />
        <TextMenu editor={editor} />
        <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
        <TableRowMenu editor={editor} appendTo={menuContainerRef} />
        <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
      </div>
    </div>
  );
};

export default BlockEditor;
