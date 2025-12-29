"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

// Storage key for tracking which SW version the user has seen the toast for
const SW_VERSION_KEY = "pwa-offline-toast-sw-version";

export function PwaStatus() {
  const hasHandledThisSession = useRef(false);
  const loadingToastId = useRef<string | number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    const showSuccessToast = () => {
      // Dismiss loading toast if it exists
      if (loadingToastId.current) {
        toast.dismiss(loadingToastId.current);
        loadingToastId.current = null;
      }

      toast.success("App is ready to work offline!", {
        description: "Note: Sync features require being logged in and online.",
        duration: 6000,
      });
    };

    const handleServiceWorker = async () => {
      if (hasHandledThisSession.current) {
        return;
      }

      try {
        // Check if this is a first visit (no version stored yet)
        const lastSeenVersion = localStorage.getItem(SW_VERSION_KEY);
        const isFirstVisit = !lastSeenVersion;

        // If first visit, show loading toast immediately
        if (isFirstVisit && !loadingToastId.current) {
          hasHandledThisSession.current = true;
          loadingToastId.current = toast.loading(
            "Preparing app for offline use...",
            {
              description: "Caching resources for the first time.",
              duration: Infinity,
            }
          );
        }

        // Wait for the service worker to be ready
        const registration = await navigator.serviceWorker.ready;
        const activeSW = registration.active;

        if (activeSW) {
          const swVersion = activeSW.scriptURL;

          // First visit: we showed loading toast, now show success
          if (isFirstVisit) {
            localStorage.setItem(SW_VERSION_KEY, swVersion);
            showSuccessToast();
          }
          // Returning visit with new SW version (update)
          else if (lastSeenVersion !== swVersion) {
            hasHandledThisSession.current = true;
            localStorage.setItem(SW_VERSION_KEY, swVersion);
            showSuccessToast();
          }
        }
      } catch (error) {
        console.error("Error handling service worker status:", error);
        // Dismiss loading toast on error
        if (loadingToastId.current) {
          toast.dismiss(loadingToastId.current);
          loadingToastId.current = null;
        }
      }
    };

    // Initial check
    handleServiceWorker();

    // Listen for new service worker installations (for updates)
    const handleControllerChange = () => {
      // Reset session flag on controller change to handle updates
      hasHandledThisSession.current = false;
      handleServiceWorker();
    };

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      handleControllerChange
    );

    return () => {
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        handleControllerChange
      );
      // Cleanup loading toast if component unmounts
      if (loadingToastId.current) {
        toast.dismiss(loadingToastId.current);
      }
    };
  }, []);

  return null;
}
