"use client";

import { IconPicker, Icon, IconName } from "@/components/ui/icon-picker";
import { Page } from "@/lib/dexie/db";

interface NoteHeaderProps {
  page: Page;
  onIconChange: (icon: IconName) => void;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function NoteHeader({
  page,
  onIconChange,
  onTitleChange,
}: NoteHeaderProps) {
  return (
    <div className="group relative mb-8 pl-12 group-hover/icon:opacity-100">
      <div className="absolute left-0 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <IconPicker value={page.icon as IconName} onValueChange={onIconChange}>
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
            onValueChange={onIconChange}>
            <span className="cursor-pointer hover:opacity-80 transition">
              <Icon name={page.icon as IconName} size={48} />
            </span>
          </IconPicker>
        </div>
      )}

      <input
        value={page.title}
        onChange={onTitleChange}
        placeholder="Untitled"
        className="text-4xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/40 w-full"
      />
    </div>
  );
}
