"use client";
import { db } from "@/lib/dexie/db";
import { useDocument, useLiveQuery } from "dexie-react-hooks";
import dynamic from "next/dynamic";
import React from "react";
import type { Doc } from "yjs";
import { Skeleton } from "@/components/ui/skeleton";

const EditorSkeleton = () => (
  <div className="space-y-3 min-h-50 animate-in fade-in-50 duration-300">
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-11/12" />
    <Skeleton className="h-4 w-4/5" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-5/6" />
  </div>
);

const Editor = dynamic(() => import("./editor"), {
  ssr: false,
  loading: () => <EditorSkeleton />,
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
