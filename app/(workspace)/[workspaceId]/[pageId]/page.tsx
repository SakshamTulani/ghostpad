"use client";

import { usePage } from "@/hooks/use-ghostpad";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import * as Y from "yjs";
import { IconPicker, Icon, IconName } from "@/components/ui/icon-picker";
import Editor from "@/components/editor";
import { useDocument } from "dexie-react-hooks";
import EditorWithProvider from "@/components/editor";

export default function PageView() {
  const params = useParams();
  const pageId = params.pageId as string;
  const { page, isLoading, updatePage } = usePage(pageId);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePage(pageId, { title: e.target.value });
  };

  const handleIconChange = (icon: IconName) => {
    updatePage(pageId, { icon });
  };

  if (isLoading) {
    return (
      <div className="p-12 text-muted-foreground animate-pulse">Loading...</div>
    );
  }

  if (!page) {
    return <div className="p-12 text-muted-foreground">Page not found</div>;
  }

  return (
    <div className="flex flex-1 flex-col max-w-5xl mx-auto w-full py-12 px-8 min-h-screen bg-background">
      {/* Cover image could go here */}

      <div className="group relative mb-8 pl-12 group-hover/icon:opacity-100">
        <div className="absolute left-0 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <IconPicker
            value={page.icon as IconName}
            onValueChange={handleIconChange}>
            <button className="flex items-center justify-center h-8 w-8 rounded hover:bg-muted transition text-muted-foreground">
              {page.icon ? (
                <Icon name={page.icon as IconName} />
              ) : (
                <span className="text-xs">Icon</span>
              )}
            </button>
          </IconPicker>
        </div>
        {page.icon && (
          <div className="text-5xl mb-4 -ml-1">
            <IconPicker
              value={page.icon as IconName}
              onValueChange={handleIconChange}>
              <span className="cursor-pointer hover:opacity-80 transition">
                <Icon name={page.icon as IconName} size={48} />
              </span>
            </IconPicker>
          </div>
        )}

        <input
          value={page.title}
          onChange={handleTitleChange}
          placeholder="Untitled"
          className="text-4xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/40 w-full"
        />
      </div>

      <div className="pl-4">
        {page && <EditorWithProvider key={page.id} page={page} />}
      </div>
    </div>
  );
}
