import { db, type Page } from "../db";
import { generateId, now } from "./utils";
import * as Y from "yjs";

/**
 * Creates a new page within a workspace.
 * @param params - Object containing title, workspaceId, and parentId.
 * @returns The ID of the created page.
 */
export const createPage = async (params: {
  title: string;
  workspaceId: string;
  parentId: string; // Could be workspaceId or another pageId
  icon?: string;
}): Promise<string> => {
  const id = generateId();
  const doc = new Y.Doc();
  const newPage: Page = {
    id,
    title: params.title,
    workspaceId: params.workspaceId,
    parentId: params.parentId,
    icon: params.icon,
    createdAt: now(),
    updatedAt: now(),
    content: doc,
    deleted: false,
  };
  await db.pages.add(newPage);
  return id;
};

/**
 * Updates an existing page's metadata.
 * @param id - The ID of the page to update.
 * @param updates - Partial page object with updates.
 */
export const updatePage = async (
  id: string,
  updates: Partial<Pick<Page, "title" | "icon">>
): Promise<void> => {
  await db.pages.update(id, {
    ...updates,
    updatedAt: now(),
  });
};

// Helper for recursion
const getDescendants = async (pageId: string): Promise<string[]> => {
  const children = await db.pages.where("parentId").equals(pageId).toArray();
  let descendants = children.map((c) => c.id);
  for (const child of children) {
    const childDescendants = await getDescendants(child.id);
    descendants = descendants.concat(childDescendants);
  }
  return descendants;
};

/**
 * Soft deletes a page and all its descendant pages.
 * @param id - The ID of the page to soft delete.
 */
export const softDeletePage = async (id: string): Promise<void> => {
  await db.transaction("rw", db.pages, async () => {
    // 1. Mark this page as deleted
    await db.pages.update(id, {
      deleted: true,
      deletedAt: now(),
    });

    // 2. Find all descendants and mark them as deleted
    // Since we can't easily query "all descendants" in one go in indexeddb without a path/closure table,
    // we might need to rely on a recursive traversal or just mark immediate children and let the UI handle "hidden parents".
    // HOWEVER, for data integrity, let's try to mark the subtree.
    // Ideally this should use a collection modify if possible, but recursive is safer for correctness.

    const descendants = await getDescendants(id);
    if (descendants.length > 0) {
      await db.pages.where("id").anyOf(descendants).modify({
        deleted: true,
        deletedAt: now(),
      });
    }
  });
};

/**
 * Restores a soft-deleted page and all its descendant pages.
 * @param id - The ID of the page to restore.
 */
export const restorePage = async (id: string): Promise<void> => {
  await db.transaction("rw", db.pages, async () => {
    // Restore specific page
    await db.pages.update(id, {
      deleted: false,
      deletedAt: undefined,
    });

    // Optionally restore descendants?
    // Usually if you restore a folder, you might want to restore contents, OR just the folder.
    // Let's restore descendants to be consistent with delete.
    const descendants = await getDescendants(id);
    if (descendants.length > 0) {
      await db.pages.where("id").anyOf(descendants).modify({
        deleted: false,
        deletedAt: undefined,
      });
    }
  });
};

/**
 * Permanently deletes a page and all its descendant pages.
 * THIS ACTION IS IRREVERSIBLE.
 * @param id - The ID of the page to hard delete.
 */
export const hardDeletePage = async (id: string): Promise<void> => {
  await db.transaction("rw", db.pages, async () => {
    const descendants = await getDescendants(id);
    const toDelete = [id, ...descendants];
    await db.pages.where("id").anyOf(toDelete).delete();
  });
};

/**
 * Retrieves a single page by ID.
 * @param id - The ID of the page.
 * @returns The Page object or undefined if not found.
 */
export const getPage = async (id: string): Promise<Page | undefined> => {
  return await db.pages.get(id);
};

/**
 * Retrieves the top-level pages of a specific workspace.
 * These are pages where the parentId is equal to the workspaceId.
 * @param workspaceId - The ID of the workspace.
 * @returns Array of root Page objects.
 */
export const getRootPages = async (workspaceId: string): Promise<Page[]> => {
  return await db.pages
    .where("workspaceId")
    .equals(workspaceId)
    .filter((p) => p.parentId === workspaceId && !p.deleted)
    .sortBy("title"); // or createdAt
};

/**
 * Retrieves the immediate child pages of a specific parent page.
 * @param parentId - The ID of the parent page.
 * @returns Array of child Page objects.
 */
export const getChildPages = async (parentId: string): Promise<Page[]> => {
  return await db.pages
    .where("parentId")
    .equals(parentId)
    .filter((p) => !p.deleted)
    .sortBy("title");
};

/**
 * Efficiently counts the number of non-deleted pages in a workspace.
 * @param workspaceId - The ID of the workspace.
 * @returns The count of pages.
 */
export const getPageCountByWorkspace = async (
  workspaceId: string
): Promise<number> => {
  return await db.pages
    .where("workspaceId")
    .equals(workspaceId)
    .filter((p) => !p.deleted)
    .count();
};

/**
 * Retrieves ALL pages in a workspace (flat list).
 * Use with caution on large workspaces.
 * @param workspaceId - The ID of the workspace.
 * @returns Array of all Page objects in the workspace.
 */
export const getAllPages = async (workspaceId: string): Promise<Page[]> => {
  return await db.pages
    .where("workspaceId")
    .equals(workspaceId)
    .filter((p) => !p.deleted)
    .toArray();
};
