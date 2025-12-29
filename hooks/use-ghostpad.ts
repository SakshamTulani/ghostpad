import { useLiveQuery } from "dexie-react-hooks";
import {
  createWorkspace,
  updateWorkspace,
  softDeleteWorkspace,
  restoreWorkspace,
  hardDeleteWorkspace,
  getAllWorkspaces,
  getWorkspace,
} from "@/lib/dexie/helpers/workspace";
import {
  createPage,
  updatePage,
  softDeletePage,
  restorePage,
  hardDeletePage,
  getRootPages,
  getChildPages,
  getPage,
  getPageCountByWorkspace,
} from "@/lib/dexie/helpers/page";
import type { Page, Workspace } from "@/lib/dexie/db";

// --- Workspace Hooks ---

/**
 * Hook to retrieve all workspaces and provide mutation functions.
 * @returns An object containing the list of workspaces, loading state, and workspace mutation functions.
 */
export const useWorkspaces = () => {
  const [workspaces, isLoaded] = useLiveQuery(
    () => getAllWorkspaces().then((res) => [res, true]),
    [],
    [[] as Workspace[], false]
  );

  return {
    /** List of all non-deleted workspaces, sorted by creation date. */
    workspaces,
    /** True while the initial query is loading. */
    isLoading: !isLoaded,
    /** Function to create a new workspace. */
    createWorkspace,
    /** Function to update an existing workspace. */
    updateWorkspace,
    /** Function to soft-delete a workspace and its pages. */
    softDeleteWorkspace,
    /** Function to restore a soft-deleted workspace. */
    restoreWorkspace,
    /** Function to permanently delete a workspace. Irreversible. */
    hardDeleteWorkspace,
  };
};

/**
 * Hook to retrieve a specific workspace by ID and provide mutation functions.
 * @param id - The ID of the workspace to retrieve.
 * @returns An object containing the workspace (if found), loading state, and mutation functions.
 */
export const useWorkspace = (id: string) => {
  const [workspace, isLoaded] = useLiveQuery(
    () => getWorkspace(id).then((res) => [res, true]),
    [id],
    [undefined, false]
  );

  return {
    /** The workspace object, or undefined if not found or loading. */
    workspace, // can be undefined if not found
    /** True while the initial query is loading. */
    isLoading: !isLoaded,
    /** Function to update this workspace. */
    updateWorkspace,
    /** Function to soft-delete this workspace. */
    softDeleteWorkspace,
    /** Function to restore this workspace. */
    restoreWorkspace,
    /** Function to permanently delete this workspace. */
    hardDeleteWorkspace,
  };
};

// --- Page Hooks ---

/**
 * Hook to retrieve the top-level (root) pages of a workspace.
 * @param workspaceId - The ID of the workspace.
 * @returns An object containing the list of root pages, loading state, and createPage function.
 */
export const useRootPages = (workspaceId: string) => {
  const [pages, isLoaded] = useLiveQuery(
    () => getRootPages(workspaceId).then((res) => [res, true]),
    [workspaceId],
    [[] as Page[], false]
  );

  return {
    /** List of root pages in the workspace. */
    pages,
    /** True while the initial query is loading. */
    isLoading: !isLoaded,
    /** Function to create a new page in this context. */
    createPage,
  };
};

/**
 * Hook to retrieve the child pages of a specific parent page.
 * @param parentId - The ID of the parent page.
 * @returns An object containing the list of child pages, loading state, and createPage function.
 */
export const useChildPages = (parentId: string) => {
  const [pages, isLoaded] = useLiveQuery(
    () => getChildPages(parentId).then((res) => [res, true]),
    [parentId],
    [[] as Page[], false]
  );

  return {
    /** List of child pages. */
    pages,
    /** True while the initial query is loading. */
    isLoading: !isLoaded,
    /** Function to create a new page in this context. */
    createPage,
  };
};

/**
 * Hook to retrieve a specific page by ID and provide mutation functions.
 * @param id - The ID of the page to retrieve.
 * @returns An object containing the page (if found), loading state, and page mutation functions.
 */
export const usePage = (id: string) => {
  const [page, isLoaded] = useLiveQuery(
    () => getPage(id).then((res) => [res, true]),
    [id],
    [undefined, false]
  );

  return {
    /** The page object, or undefined if not found or loading. */
    page, // can be undefined if not found
    /** True while the initial query is loading. */
    isLoading: !isLoaded,
    /** Function to update this page. */
    updatePage,
    /** Function to soft-delete this page. */
    softDeletePage,
    /** Function to restore this page. */
    restorePage,
    /** Function to permanently delete this page. */
    hardDeletePage,
  };
};

/**
 * Hook to get the count of non-deleted pages in a workspace.
 * @param workspaceId - The ID of the workspace.
 * @returns An object containing the count and loading state.
 */
export const usePageCount = (workspaceId: string) => {
  const [count, isLoaded] = useLiveQuery(
    () => getPageCountByWorkspace(workspaceId).then((res) => [res, true]),
    [workspaceId],
    [undefined, false]
  );

  return {
    /** The number of pages in the workspace. */
    count,
    /** True while the initial query is loading. */
    isLoading: !isLoaded,
  };
};
