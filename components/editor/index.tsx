"use client";
import { db } from "@/lib/dexie/db";
import { useDocument, useLiveQuery } from "dexie-react-hooks";
import dynamic from "next/dynamic";
import React from "react";
import type { Doc } from "yjs";

const Editor = dynamic(() => import("./editor"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-125">
      <div className="animate-pulse text-muted-foreground">
        Loading editor...
      </div>
    </div>
  ),
});

const EditorWrapper = ({ pageId }: { pageId: string }) => {
  const page = useLiveQuery(() => db.pages.get(pageId), [pageId]);
  const doc = page?.content;
  if (!doc) return null;
  return <MemoisedEditorWithProvider doc={doc} />;
};

const EditorWithProvider = ({ doc }: { doc: Doc }) => {
  const provider = useDocument(doc);
  return provider ? <Editor doc={doc} provider={provider} /> : null;
};
const MemoisedEditorWithProvider = React.memo(EditorWithProvider);
const MemoisedEditorWrapper = React.memo(EditorWrapper);

export default MemoisedEditorWrapper;
