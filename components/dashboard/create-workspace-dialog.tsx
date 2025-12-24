"use client";

import { useState } from "react";
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
import { useWorkspaces } from "@/hooks/use-ghostpad";
import { IconPicker, IconName } from "@/components/ui/icon-picker";
import { useForm } from "@tanstack/react-form";
import { workspaceSchema } from "@/lib/schemas";
import { WORKSPACE_DEFAULTS } from "@/lib/defaults";

interface CreateWorkspaceDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateWorkspaceDialog({
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: CreateWorkspaceDialogProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const { createWorkspace } = useWorkspaces();

  // Use external state if provided, otherwise internal
  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen : internalOpen;
  const setOpen = isControlled ? externalOnOpenChange! : setInternalOpen;

  const form = useForm({
    defaultValues: {
      name: "",
      icon: WORKSPACE_DEFAULTS.icon,
    },
    validators: {
      onChange: workspaceSchema,
    },
    onSubmit: async ({ value }) => {
      await createWorkspace(value.name, value.icon);
      setOpen(false);
      form.reset();
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Create Workspace
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Create Workspace</DialogTitle>
          <DialogDescription>
            Give your new workspace a name and an icon.
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
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="My Workspace"
                  autoFocus
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name="icon"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor="icon">Icon</FieldLabel>
                <IconPicker
                  modal
                  value={field.state.value as IconName}
                  onValueChange={(val) => field.handleChange(val)}
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          />

          <DialogFooter>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit}>
                  {isSubmitting ? "Creating..." : "Create"}
                </Button>
              )}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
