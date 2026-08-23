/**
 * Shared helpers for the mock service layer.
 *
 * Services validate input, simulate a short round-trip, and return the
 * resulting entity. They never touch React state — the Redux slices own the
 * mock data and commit whatever a service hands back.
 */

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

/** Thrown by a service when input fails validation. */
export class ValidationError<T> extends Error {
  readonly fieldErrors: FieldErrors<T>;

  constructor(fieldErrors: FieldErrors<T>) {
    super("Please fix the highlighted fields.");
    this.name = "ValidationError";
    this.fieldErrors = fieldErrors;
  }
}

export function isValidationError<T>(error: unknown): error is ValidationError<T> {
  return error instanceof ValidationError;
}

/** Small delay so loading states are observable without feeling sluggish. */
export function latency(ms = 350): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Rejects with a ValidationError when any field error is present. */
export async function commit<T, R>(
  fieldErrors: FieldErrors<T>,
  build: () => R,
): Promise<R> {
  if (Object.keys(fieldErrors).length > 0) {
    throw new ValidationError<T>(fieldErrors);
  }
  await latency();
  return build();
}

export function isBlank(value: string | undefined | null): boolean {
  return !value || value.trim().length === 0;
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** True when the value is not a finite number, or falls outside the bounds. */
export function outOfRange(value: number, min: number, max = Number.MAX_SAFE_INTEGER) {
  return !Number.isFinite(value) || value < min || value > max;
}
