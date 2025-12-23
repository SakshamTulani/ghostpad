import { db, type Workspace } from "../db";
import { generateId, now } from "./utils";

/**
 * Creates a new workspace with the given name.
 * @param name - The name of the workspace.
 * @returns The ID of the created workspace.
 */
export const createWorkspace = async (
  name: string,
  icon?: string
): Promise<string> => {
  const id = generateId();
  await db.workspaces.add({
    id,
    name,
    icon,
    createdAt: now(),
    deleted: false,
    updatedAt: now(),
  });
  return id;
};

/**
 * Updates an existing workspace.
 * @param id - The ID of the workspace to update.
 * @param updates - Partial workspace object containing the updates.
 */
export const updateWorkspace = async (
  id: string,
  updates: Partial<Pick<Workspace, "name" | "icon">>
): Promise<void> => {
  await db.workspaces.update(id, {
    ...updates,
    updatedAt: now(),
  });
};

/**
 * Soft deletes a workspace and all its pages.
 * @param id - The ID of the workspace to soft delete.
 */
export const softDeleteWorkspace = async (id: string): Promise<void> => {
  await db.transaction("rw", db.workspaces, db.pages, async () => {
    // 1. Mark workspace as deleted
    await db.workspaces.update(id, {
      deleted: true,
      deletedAt: now(),
    });

    // 2. Mark all pages in this workspace as deleted
    // We iterate over all pages that belong to this workspace
    await db.pages
      .where("workspaceId")
      .equals(id)
      .modify({ deleted: true, deletedAt: now() });
  });
};

/**
 * Restores a soft-deleted workspace and all its pages.
 * @param id - The ID of the workspace to restore.
 */
export const restoreWorkspace = async (id: string): Promise<void> => {
  await db.transaction("rw", db.workspaces, db.pages, async () => {
    // 1. Restore workspace // remove deletedAt
    await db.workspaces.update(id, {
      deleted: false,
      deletedAt: undefined,
    });

    // 2. Restore all pages in this workspace
    // Note: This restores EVERYTHING. A more granular approach might be needed
    // if we want to keep some pages deleted, but for now this restores the state.
    await db.pages
      .where("workspaceId")
      .equals(id)
      .modify({ deleted: false, deletedAt: undefined });
  });
};

/**
 * Permanently deletes a workspace and all its associated pages.
 * THIS ACTION IS IRREVERSIBLE.
 * @param id - The ID of the workspace to hard delete.
 */
export const hardDeleteWorkspace = async (id: string): Promise<void> => {
  await db.transaction("rw", db.workspaces, db.pages, async () => {
    // 1. Delete all pages in this workspace
    await db.pages.where("workspaceId").equals(id).delete();

    // 2. Delete the workspace
    await db.workspaces.delete(id);
  });
};

/**
 * Retrieves all non-deleted workspaces, sorted by creation date (newest first).
 * @returns Array of Workspace objects.
 */
export const getAllWorkspaces = async (): Promise<Workspace[]> => {
  return await db.workspaces
    .filter((w) => !w.deleted)
    .reverse()
    .sortBy("createdAt");
};

/**
 * Retrieves a single workspace by ID.
 * @param id - The ID of the workspace.
 * @returns The Workspace object or undefined if not found.
 */
export const getWorkspace = async (
  id: string
): Promise<Workspace | undefined> => {
  return await db.workspaces.get(id);
};
