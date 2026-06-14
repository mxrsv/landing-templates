import { z } from "zod";

/** Result of validating a waitlist email — `error` is set only when `ok` is false. */
export interface EmailValidation {
  ok: boolean;
  error?: string;
}

// zod 4: top-level `z.email()` is the current string-format check
// (`z.string().email()` is deprecated). Verified against zod 4.4.3.
const emailSchema = z.email();

/**
 * Validate a waitlist email address. Pure — no React, no Web API — so it is
 * unit-testable in isolation and reusable by the hero form and closing CTA.
 *
 * Leading/trailing whitespace is trimmed before validation (paste-friendly).
 * Empty input gets a distinct, friendly message from malformed input.
 */
export function validateEmail(value: string): EmailValidation {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return { ok: false, error: "Please enter your email." };
  }

  if (!emailSchema.safeParse(trimmed).success) {
    return { ok: false, error: "Enter a valid email address." };
  }

  return { ok: true };
}
