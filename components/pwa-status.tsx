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
        const registration = await navigator.serviceWorker.getRegistration();

        if (!registration) {
          return;
        }

        // Get the active SW's script URL as a version identifier
        const activeSW = registration.active;
        const installingSW = registration.installing;
        const waitingSW = registration.waiting;

        // If there's an installing SW, show loading toast
        if (installingSW) {
          hasHandledThisSession.current = true;

          loadingToastId.current = toast.loading(
            "Preparing app for offline use...",
            {
              description: "Caching resources for the first time.",
              duration: Infinity,
            }
          );

          // Listen for state changes on the installing SW
          installingSW.addEventListener("statechange", () => {
            if (installingSW.state === "activated") {
              const swVersion = installingSW.scriptURL;
              localStorage.setItem(SW_VERSION_KEY, swVersion);
              showSuccessToast();
            }
          });

          return;
        }

        // If there's a waiting SW, it means an update is available
        if (waitingSW) {
          // Optional: You could show an "update available" toast here
          return;
        }

        // If there's an active SW, check if we've shown toast for this version
        if (activeSW) {
          const swVersion = activeSW.scriptURL;
          const lastSeenVersion = localStorage.getItem(SW_VERSION_KEY);

          // Only show toast if this is a new version or first time
          if (lastSeenVersion !== swVersion) {
            hasHandledThisSession.current = true;
            localStorage.setItem(SW_VERSION_KEY, swVersion);
            showSuccessToast();
          }
        }
      } catch (error) {
        console.error("Error handling service worker status:", error);
      }
    };

    // Initial check
    handleServiceWorker();

    // Listen for new service worker installations
    const handleControllerChange = () => {
      if (!hasHandledThisSession.current) {
        handleServiceWorker();
      }
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
