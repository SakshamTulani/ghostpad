import { z } from "zod";

export const workspaceSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  icon: z.string(),
});

export type WorkspaceFormValues = z.infer<typeof workspaceSchema>;

// Auth schemas
export const emailSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

export const otpSchema = z.object({
  otp: z
    .string()
    .min(1, "Verification code is required")
    .regex(/^[a-zA-Z0-9]+$/, "Code should only contain letters and numbers"),
});

export type EmailFormValues = z.infer<typeof emailSchema>;
export type OtpFormValues = z.infer<typeof otpSchema>;
