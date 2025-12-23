"use client";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useTheme } from "next-themes";
import { useDocument, useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/dexie/db";
import { type DexieYProvider } from "y-dexie";
import * as Y from "yjs";

export default function Editor({
  provider,
  doc,
}: {
  provider: DexieYProvider;
  doc: Y.Doc;
}) {
  const editor = useCreateBlockNote({
    collaboration: {
      provider: provider,
      fragment: doc.getXmlFragment("document-store"),
      // Information (name and color) for this user:
      user: {
        name: "My Username",
        color: "#ff0000",
      },
      // When to show user labels on the collaboration cursor. Set by default to
      // "activity" (show when the cursor moves), but can also be set to "always".
      showCursorLabels: "activity",
    },
    animations: true,
  });

  const theme = useTheme();
  // Renders the editor instance using a React component.
  return (
    <BlockNoteView
      editor={editor}
      theme={theme.resolvedTheme as "dark" | "light"}
      shadCNComponents={{
        Input: { Input },
        DropdownMenu: {
          DropdownMenu: DropdownMenu,
          DropdownMenuContent: DropdownMenuContent,
          DropdownMenuItem: DropdownMenuItem,
          DropdownMenuTrigger: DropdownMenuTrigger,
          DropdownMenuCheckboxItem: DropdownMenuCheckboxItem,
          DropdownMenuLabel: DropdownMenuLabel,
          DropdownMenuSeparator: DropdownMenuSeparator,
          DropdownMenuSub: DropdownMenuSub,
          DropdownMenuSubContent: DropdownMenuSubContent,
          DropdownMenuSubTrigger: DropdownMenuSubTrigger,
        },
        Label: { Label },
        Select: {
          Select: Select,
          SelectContent: SelectContent,
          SelectItem: SelectItem,
          SelectTrigger: SelectTrigger,
          SelectValue: SelectValue,
        },
        Card: {
          Card: Card,
          CardContent: CardContent,
        },
        Button: { Button: Button },
        Badge: { Badge: Badge },
      }}
    />
  );
}
