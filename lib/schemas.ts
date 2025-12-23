import { iconNames } from "lucide-react/dynamic";
import { z } from "zod";

export const workspaceSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  icon: z.literal(iconNames),
});

export type WorkspaceFormValues = z.infer<typeof workspaceSchema>;
