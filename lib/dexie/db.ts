import Dexie, { type EntityTable } from "dexie";
import yDexie from "y-dexie";
import type * as Y from "yjs";

export interface Workspace {
  id: string;
  name: string;
  icon?: string;
  createdAt: number;
  deleted?: boolean;
  updatedAt: number;
  deletedAt?: number;
}

export interface Page {
  id: string;
  icon?: string;
  title: string;
  workspaceId: string;
  parentId: string; // Can be a Workspace ID or another Page ID
  createdAt: number;
  updatedAt: number;
  content: Y.Doc;
  deleted?: boolean;
  deletedAt?: number;
}

export class GhostpadDatabase extends Dexie {
  workspaces!: EntityTable<Workspace, "id">;
  pages!: EntityTable<Page, "id">;

  constructor() {
    // Add the yDexie addon to handle Y.Doc properties
    super("ghostpad-db", { addons: [yDexie] });

    this.version(1).stores({
      // Workspace index
      workspaces: `id, name, updatedAt`,

      /**
       * Page index:
       * - parentId & workspaceId: For building the recursive tree.
       * - content: Y.Doc: Special syntax for the y-dexie addon.
       */
      pages: `
        id, 
        parentId, 
        workspaceId, 
        updatedAt, 
        content: Y.Doc
      `,
    });
  }
}

// Export a singleton instance for use across the app
export const db = new GhostpadDatabase();
