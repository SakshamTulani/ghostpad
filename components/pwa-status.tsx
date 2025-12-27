"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

export function PwaStatus() {
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    const handleServiceWorkerReady = async () => {
      // Check if we've already shown the toast in this session
      const toastShownKey = "pwa-offline-toast-shown";
      const hasShownPreviously = sessionStorage.getItem(toastShownKey);

      if (hasShownPreviously || hasShownToast.current) {
        return;
      }

      // Wait for the service worker to be ready
      const registration = await navigator.serviceWorker.ready;

      if (registration.active) {
        hasShownToast.current = true;
        sessionStorage.setItem(toastShownKey, "true");

        toast.success("App is ready to work offline!", {
          description:
            "Note: Sync features require being logged in and online.",
          duration: 6000,
        });
      }
    };

    // Check immediately and also listen for state changes
    handleServiceWorkerReady();

    // Listen for controlling service worker changes
    navigator.serviceWorker.addEventListener(
      "controllerchange",
      handleServiceWorkerReady
    );

    return () => {
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        handleServiceWorkerReady
      );
    };
  }, []);

  return null;
}
