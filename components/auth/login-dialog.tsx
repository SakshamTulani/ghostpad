"use client";

import * as React from "react";
import { db } from "@/lib/dexie/db";
import { useObservable } from "dexie-react-hooks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  Mail,
  KeyRound,
  AlertCircle,
  Info,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import { emailSchema, otpSchema } from "@/lib/schemas";
import { resolveText } from "dexie-cloud-addon";
import { Logo } from "../logo";

export function LoginDialog() {
  const userInteraction = useObservable(db.cloud.userInteraction);
  const currentType = userInteraction?.type;
  const isOpen = !!userInteraction;

  // Email form
  const emailForm = useForm({
    defaultValues: { email: "" },
    validators: { onChange: emailSchema },
    onSubmit: async ({ value }) => {
      if (userInteraction?.type === "email") {
        userInteraction.onSubmit({ email: value.email });
      }
    },
  });

  // OTP form
  const otpForm = useForm({
    defaultValues: { otp: "" },
    validators: { onChange: otpSchema },
    onSubmit: async ({ value }) => {
      if (userInteraction?.type === "otp") {
        userInteraction.onSubmit({ otp: value.otp });
      }
    },
  });

  // Reset forms when interaction type changes
  React.useEffect(() => {
    if (currentType === "email") {
      emailForm.reset();
    } else if (currentType === "otp") {
      otpForm.reset();
    }
  }, [currentType, emailForm, otpForm]);

  const handleCancel = () => {
    userInteraction?.onCancel();
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertCircle className="h-4 w-4 shrink-0" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 shrink-0" />;
      case "info":
        return <Info className="h-4 w-4 shrink-0" />;
      default:
        return null;
    }
  };

  const renderAlerts = () => {
    if (!userInteraction?.alerts || userInteraction.alerts.length === 0) {
      return null;
    }

    return (
      <div className="space-y-2">
        {userInteraction.alerts.map((alert, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center gap-2 rounded-xl px-3 py-2 text-sm",
              alert.type === "error" && "bg-destructive/10 text-destructive",
              alert.type === "warning" &&
                "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
              alert.type === "info" &&
                "bg-blue-500/10 text-blue-600 dark:text-blue-400"
            )}>
            {getAlertIcon(alert.type)}
            <span>{resolveText(alert)}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderEmailForm = () => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        emailForm.handleSubmit();
      }}
      className="space-y-6">
      <div className="flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-8 w-8 text-primary" />
        </div>
      </div>

      {renderAlerts()}

      <emailForm.Field
        name="email"
        children={(field) => (
          <Field>
            <FieldLabel htmlFor="email">Email Address</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder={
                userInteraction?.fields?.email?.placeholder ||
                "Enter your email"
              }
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              autoFocus
              autoComplete="email"
              className="h-12"
            />
            <FieldError errors={field.state.meta.errors} />
          </Field>
        )}
      />

      <DialogFooter className="flex-col gap-2 sm:flex-col">
        <emailForm.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              className="w-full h-11"
              disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending code...
                </>
              ) : (
                userInteraction?.submitLabel || "Continue"
              )}
            </Button>
          )}
        />
        {userInteraction?.cancelLabel && (
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={handleCancel}>
            {userInteraction.cancelLabel}
          </Button>
        )}
      </DialogFooter>
    </form>
  );

  const renderOtpForm = () => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        otpForm.handleSubmit();
      }}
      className="space-y-6">
      <div className="flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <KeyRound className="h-8 w-8 text-primary" />
        </div>
      </div>

      {renderAlerts()}

      <otpForm.Field
        name="otp"
        children={(field) => (
          <Field>
            <FieldLabel htmlFor="otp">
              {userInteraction?.fields?.otp?.label || "Verification Code"}
            </FieldLabel>
            <Input
              id="otp"
              type="text"
              placeholder="Enter the code from your email"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              autoFocus
              autoComplete="one-time-code"
              className="h-12 text-center text-lg tracking-widest"
            />
            <FieldError errors={field.state.meta.errors} />
            <p className="text-xs text-muted-foreground text-center">
              We sent a verification code to your email
            </p>
          </Field>
        )}
      />

      <DialogFooter className="flex-col gap-2 sm:flex-col">
        <otpForm.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              className="w-full h-11"
              disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                userInteraction?.submitLabel || "Verify"
              )}
            </Button>
          )}
        />
        {userInteraction?.cancelLabel && (
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={handleCancel}>
            {userInteraction.cancelLabel}
          </Button>
        )}
      </DialogFooter>
    </form>
  );

  const renderMessageAlert = () => (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Info className="h-8 w-8 text-primary" />
        </div>
      </div>

      {renderAlerts()}

      <DialogFooter className="flex-col gap-2 sm:flex-col">
        <Button
          type="button"
          className="w-full h-11"
          onClick={() => userInteraction?.onSubmit({})}>
          {userInteraction?.submitLabel || "OK"}
        </Button>
      </DialogFooter>
    </div>
  );

  const renderLogoutConfirmation = () => (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10">
          <AlertTriangle className="h-8 w-8 text-yellow-500" />
        </div>
      </div>

      {renderAlerts()}

      <DialogFooter className="flex-col gap-2 sm:flex-col">
        <Button
          type="button"
          variant="destructive"
          className="w-full h-11"
          onClick={() => userInteraction?.onSubmit({})}>
          {userInteraction?.submitLabel || "Log out anyway"}
        </Button>
        {userInteraction?.cancelLabel && (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleCancel}>
            {userInteraction.cancelLabel}
          </Button>
        )}
      </DialogFooter>
    </div>
  );

  const getTitle = () => {
    switch (currentType) {
      case "email":
        return "Sign in to Ghostpad";
      case "otp":
        return "Enter verification code";
      case "message-alert":
        return userInteraction?.title || "Notice";
      case "logout-confirmation":
        return "Unsaved changes";
      default:
        return userInteraction?.title || "Authentication";
    }
  };

  const getDescription = () => {
    switch (currentType) {
      case "email":
        return "Enter your email to receive a one-time verification code";
      case "otp":
        return "Check your inbox for the verification code";
      case "logout-confirmation":
        return "You have unsynced changes that will be lost if you log out now";
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (currentType) {
      case "email":
        return renderEmailForm();
      case "otp":
        return renderOtpForm();
      case "message-alert":
        return renderMessageAlert();
      case "logout-confirmation":
        return renderLogoutConfirmation();
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 shadow-xl border border-border/50 backdrop-blur-sm">
            <Logo size={64} className="animate-bounce-slow" />
          </div>
          <DialogTitle className="text-xl">{getTitle()}</DialogTitle>
          {getDescription() && (
            <DialogDescription className="text-center">
              {getDescription()}
            </DialogDescription>
          )}
        </DialogHeader>

        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
