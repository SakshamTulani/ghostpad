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

export default function Editor() {
  // Creates a new editor instance.
  const editor = useCreateBlockNote({
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
