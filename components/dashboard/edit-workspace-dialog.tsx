"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Workspace } from "@/lib/dexie/db";
import { useWorkspace } from "@/hooks/use-ghostpad";
// import { IconPicker, IconName } from "@/components/ui/icon-picker";
import { useForm } from "@tanstack/react-form";
import { workspaceSchema } from "@/lib/schemas";

interface EditWorkspaceDialogProps {
  workspace: Workspace;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditWorkspaceDialog({
  workspace,
  open,
  onOpenChange,
}: EditWorkspaceDialogProps) {
  const { updateWorkspace } = useWorkspace(workspace.id);

  const form = useForm({
    defaultValues: {
      name: workspace.name,
      icon: (workspace.icon as string) || "ghost",
    },
    validators: {
      onChange: workspaceSchema,
    },
    onSubmit: async ({ value }) => {
      await updateWorkspace(workspace.id, {
        name: value.name,
        icon: value.icon,
      });
      onOpenChange(false);
    },
  });

  // Reset form when workspace changes or dialog opens/closes
  useEffect(() => {
    if (open) {
      form.reset({
        name: workspace.name,
        icon: (workspace.icon as string) || "ghost",
      });
    }
  }, [open, workspace, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Edit Workspace</DialogTitle>
          <DialogDescription>
            Update the name and icon of your workspace.
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
                <FieldLabel htmlFor="edit-name">Name</FieldLabel>
                <Input
                  id="edit-name"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Workspace Name"
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name="icon"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor="edit-icon">Icon</FieldLabel>
                {/* <IconPicker
                  modal
                  value={field.state.value as IconName}
                  onValueChange={(val) => field.handleChange(val)}
                /> */}
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          />

          <DialogFooter>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              )}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
