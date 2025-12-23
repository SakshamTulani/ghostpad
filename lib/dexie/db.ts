import Dexie, { type EntityTable } from "dexie";
import yDexie from "y-dexie";
import * as Y from "yjs";

export interface Note {
  id: string;
  title: string;
  content: Y.Doc;
}

export class GhostpadDatabase extends Dexie {
  notes!: EntityTable<Note, "id">;

  constructor() {
    super("ghostpad-db", { addons: [yDexie] });
    this.version(1).stores({
      notes: `id, title, content: Y.Doc`,
    });

    this.on("populate", () => {
      const note: Note = {
        id: "initial",
        title: "Welcome to Ghostpad",
        content: new Y.Doc(),
      };
      this.notes.put(note);
    });
  }
}

export const db = new GhostpadDatabase();
