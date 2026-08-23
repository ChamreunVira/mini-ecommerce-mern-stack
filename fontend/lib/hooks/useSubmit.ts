"use client";

import { useCallback, useState } from "react";
import { useToast } from "@/components/ToastProvider";
import { FieldErrors, isValidationError } from "@/lib/services/support";

/**
 * Runs one mock-service call and owns the UI states around it: pending flag,
 * per-field errors, and the success/error toast.
 *
 * Pages stay declarative — they hand over an async task and get back
 * `{ submit, pending, fieldErrors }` instead of juggling three useStates each.
 */
export function useSubmit<TInput>() {
  const toast = useToast();
  const [pending, setPending] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<TInput>>({});

  const clearErrors = useCallback(() => setFieldErrors({}), []);

  /**
   * Returns true when the task resolved, false when it failed — callers use
   * that to decide whether to close a modal or navigate away.
   */
  const submit = useCallback(
    async (task: () => Promise<unknown>, successMessage: string): Promise<boolean> => {
      setPending(true);
      setFieldErrors({});
      try {
        await task();
        toast.success(successMessage);
        return true;
      } catch (error) {
        // Validation failures paint the form; anything else is a generic toast.
        if (isValidationError<TInput>(error)) {
          setFieldErrors(error.fieldErrors);
          toast.error(error.message);
        } else {
          toast.error("Something went wrong. Please try again.");
        }
        return false;
      } finally {
        setPending(false);
      }
    },
    [toast],
  );

  return { submit, pending, fieldErrors, clearErrors };
}
