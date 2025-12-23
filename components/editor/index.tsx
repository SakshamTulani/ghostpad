"use client";
import { db } from "@/lib/dexie/db";
import { useDocument, useLiveQuery } from "dexie-react-hooks";
import dynamic from "next/dynamic";
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

export function BlockNoteEditor() {
  const note = useLiveQuery(() => db.notes.get("initial"));
  console.log(note);

  // Use it's document property (friend is undefined on intial render)
  const provider = useDocument(note?.content);
  if (!provider || !note?.content) return null;

  return <Editor provider={provider} doc={note?.content} />;
}
