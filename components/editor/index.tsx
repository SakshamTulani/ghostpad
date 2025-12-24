"use client";

import type { Page } from "@/lib/dexie/db";
import { useDocument } from "dexie-react-hooks";
import dynamic from "next/dynamic";
import React from "react";

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

const EditorWithProvider = ({ page }: { page: Page }) => {
  const provider = useDocument(page.content);
  if (!provider || !provider.doc) {
    return <div>Loading...</div>;
  }

  return <Editor provider={provider} doc={provider.doc} />;
};

export default EditorWithProvider;
