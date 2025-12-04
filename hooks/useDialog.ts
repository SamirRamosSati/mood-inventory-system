"use client";

import { useState, useCallback } from "react";

export type DialogVariant = "danger" | "primary" | "success";

export interface DialogConfig {
  isOpen: boolean;
  title: string;
  description?: string;
  children?: React.ReactNode;
  primaryAction?: {
    label: string;
    variant?: DialogVariant;
  };
  secondaryAction?: {
    label: string;
  };
  closeOnClickOutside?: boolean;
}

export function useDialog() {
  const [config, setConfig] = useState<DialogConfig>({
    isOpen: false,
    title: "",
  });

  const [callbacks, setCallbacks] = useState<{
    onPrimary?: () => void;
    onSecondary?: () => void;
  }>({});

  const [isLoading, setIsLoading] = useState(false);

  const closeDialog = useCallback(() => {
    setConfig((prev) => ({ ...prev, isOpen: false }));
    setCallbacks({});
    setIsLoading(false);
  }, []);

  const confirm = useCallback(
    (
      title: string,
      description?: string,
      options?: {
        primaryLabel?: string;
        secondaryLabel?: string;
        variant?: "danger" | "primary" | "success";
        closeOnClickOutside?: boolean;
      }
    ): Promise<boolean> => {
      return new Promise((resolve) => {
        setConfig({
          isOpen: true,
          title,
          description,
          primaryAction: {
            label: options?.primaryLabel || "Confirm",
            variant: options?.variant || "primary",
          },
          secondaryAction: {
            label: options?.secondaryLabel || "Cancel",
          },
          closeOnClickOutside: options?.closeOnClickOutside ?? true,
        });

        setCallbacks({
          onPrimary: () => {
            resolve(true);
            closeDialog();
          },
          onSecondary: () => {
            resolve(false);
            closeDialog();
          },
        });
      });
    },
    [closeDialog]
  );

  const alert = useCallback(
    (
      title: string,
      description?: string,
      options?: {
        label?: string;
        variant?: "danger" | "primary" | "success";
        children?: React.ReactNode;
      }
    ) => {
      setConfig({
        isOpen: true,
        title,
        description,
        children: options?.children,
        primaryAction: {
          label: options?.label || "OK",
          variant: options?.variant || "primary",
        },
        closeOnClickOutside: true,
      });

      setCallbacks({
        onPrimary: closeDialog,
      });
    },
    [closeDialog]
  );

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  return {
    config: {
      ...config,
      primaryAction: config.primaryAction
        ? { ...config.primaryAction, loading: isLoading }
        : undefined,
    },
    confirm,
    alert,
    close: closeDialog,
    setLoading,
    onPrimary: callbacks.onPrimary,
    onSecondary: callbacks.onSecondary,
  };
}
