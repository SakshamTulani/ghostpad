/**
 * Default values for creating new workspaces and pages.
 * Centralized here so they can be changed in one place.
 */

export const WORKSPACE_DEFAULTS = {
  name: "My Workspace",
  icon: "👻" as string,
} as const;

export const PAGE_DEFAULTS = {
  title: "Untitled",
  icon: undefined as string | undefined,
} as const;
