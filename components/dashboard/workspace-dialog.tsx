"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Workspace } from "@/lib/dexie/db";
import { useWorkspaces, useWorkspace } from "@/hooks/use-ghostpad";
import { EmojiPicker, Emoji } from "@/components/ui/icon-picker";
import { useForm } from "@tanstack/react-form";
import { workspaceSchema } from "@/lib/schemas";
import { WORKSPACE_DEFAULTS } from "@/lib/defaults";

interface WorkspaceDialogProps {
  /** Workspace to edit. If undefined, dialog is in create mode. */
  workspace?: Workspace;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Called after successful create/update with the workspace ID */
  onSuccess?: (workspaceId: string) => void;
  /** Show trigger button (only for create mode when uncontrolled) */
  showTrigger?: boolean;
}

export function WorkspaceDialog({
  workspace,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  onSuccess,
  showTrigger = false,
}: WorkspaceDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const { createWorkspace } = useWorkspaces();
  const { updateWorkspace } = useWorkspace(workspace?.id ?? "");

  const isEditMode = !!workspace;
  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen : internalOpen;
  const setOpen = isControlled ? externalOnOpenChange! : setInternalOpen;

  const form = useForm({
    defaultValues: {
      name: workspace?.name ?? "",
      icon: workspace?.icon ?? WORKSPACE_DEFAULTS.icon,
    },
    validators: {
      onChange: workspaceSchema,
    },
    onSubmit: async ({ value }) => {
      if (isEditMode) {
        await updateWorkspace(workspace.id, {
          name: value.name,
          icon: value.icon,
        });
        setOpen(false);
        onSuccess?.(workspace.id);
      } else {
        const workspaceId = await createWorkspace(value.name, value.icon);
        setOpen(false);
        form.reset();
        onSuccess?.(workspaceId);
      }
    },
  });

  // Reset form when workspace changes or dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        name: workspace?.name ?? "",
        icon: workspace?.icon ?? WORKSPACE_DEFAULTS.icon,
      });
    }
  }, [open, workspace, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {showTrigger && !isControlled && !isEditMode && (
        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Create Workspace
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Workspace" : "Create Workspace"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the name and icon of your workspace."
              : "Give your new workspace a name and an icon."}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="grid gap-4 py-4">
          <form.Field
            name="name"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor="workspace-name">Name</FieldLabel>
                <Input
                  id="workspace-name"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="My Workspace"
                  autoFocus={!isEditMode}
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name="icon"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor="workspace-icon">Icon</FieldLabel>
                <EmojiPicker
                  value={field.state.value}
                  onValueChange={(val) => field.handleChange(val)}>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start">
                    <Emoji emoji={field.state.value} size={20} />
                    <span className="ml-2 text-muted-foreground">
                      Click to select an emoji
                    </span>
                  </Button>
                </EmojiPicker>
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          />

          <DialogFooter>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit}>
                  {isSubmitting
                    ? isEditMode
                      ? "Saving..."
                      : "Creating..."
                    : isEditMode
                    ? "Save Changes"
                    : "Create"}
                </Button>
              )}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
