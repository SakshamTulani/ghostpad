"use client";
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
  return <Editor />;
}
