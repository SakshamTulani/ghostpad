import { ModeToggle } from "@/components/dark-mode-toggle";
import { BlockNoteEditor } from "@/components/editor";

export default function Page() {
  return (
    <div className="min-h-125">
      <ModeToggle />
      <BlockNoteEditor />
    </div>
  );
}
