"use client";

import { EmojiPicker, Emoji } from "@/components/ui/icon-picker";
import { Page } from "@/lib/dexie/db";
import { Input } from "../ui/input";
import { Smile } from "lucide-react";
import React from "react";

interface NoteHeaderProps {
  page: Page;
  onIconChange: (icon: string) => void;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function NoteHeader({
  page,
  onIconChange,
  onTitleChange,
}: NoteHeaderProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const cursorPosRef = React.useRef<number | null>(null);

  // Preserve cursor position after re-render
  React.useEffect(() => {
    if (inputRef.current && cursorPosRef.current !== null) {
      inputRef.current.setSelectionRange(
        cursorPosRef.current,
        cursorPosRef.current
      );
      cursorPosRef.current = null;
    }
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    cursorPosRef.current = e.target.selectionStart;
    onTitleChange(e);
  };

  return (
    <div className="group relative mb-8 pl-12 group-hover/icon:opacity-100">
      {!page.icon && (
        <div className="absolute left-0 top-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <EmojiPicker value={page.icon} onValueChange={onIconChange}>
            <button className="flex items-center justify-center h-8 w-8 rounded hover:bg-muted transition text-muted-foreground">
              <Smile className="h-5 w-5" />
            </button>
          </EmojiPicker>
        </div>
      )}
      {page.icon && (
        <div className="text-5xl mb-4 -ml-1">
          <EmojiPicker value={page.icon} onValueChange={onIconChange}>
            <span className="cursor-pointer hover:opacity-80 transition inline-flex max-content">
              <Emoji emoji={page.icon} size={48} />
            </span>
          </EmojiPicker>
        </div>
      )}

      <Input
        ref={inputRef}
        value={page.title}
        onChange={handleTitleChange}
        placeholder="Untitled"
        className="h-auto text-2xl md:text-5xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/40 w-full"
      />
    </div>
  );
}
