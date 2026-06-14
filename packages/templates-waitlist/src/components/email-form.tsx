"use client";

import { type FormEvent, useId, useState } from "react";
import { validateEmail } from "../lib/waitlist-email";

interface EmailFormProps {
  placeholder?: string;
  submitLabel?: string;
  /** Confirmation line shown after a valid submit. */
  confirm?: string;
  /** Optional social-proof line under the form (hero uses it; CTA omits). */
  proof?: string;
}

/**
 * Email capture — simple-confirm, client-only (spec §7). Validates via the pure
 * `validateEmail`, shows the error only after the field is touched, and on a
 * valid submit swaps to a confirmation line. It never sends or stores the email:
 * this is a template demo; the integrator wires the real endpoint where marked.
 *
 * Per react-patterns (one field, live compute, no submit-side-effects) this uses
 * plain `useState` + a `touched` flag rather than a form library.
 */
export function EmailForm({
  placeholder = "you@email.com",
  submitLabel = "Join waitlist",
  confirm = "✓ You're on the list — see you when early access opens.",
  proof,
}: EmailFormProps) {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const inputId = useId();
  const errorId = useId();

  const validation = validateEmail(email);
  const showError = touched && !confirmed && !validation.ok;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);
    if (!validateEmail(email).ok) return;
    // TODO(integrator): POST email here (CRM / ESP / double opt-in).
    // By design this template stays client-only — nothing is sent or stored.
    setConfirmed(true);
  }

  if (confirmed) {
    return (
      <p className="wl-ok" role="status">
        {confirm}
      </p>
    );
  }

  return (
    <>
      <form className="wl-form" onSubmit={handleSubmit} noValidate>
        <label className="wl-sr-only" htmlFor={inputId}>
          Email
        </label>
        <input
          id={inputId}
          className="wl-input"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={placeholder}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          onBlur={() => setTouched(true)}
          aria-invalid={showError}
          aria-describedby={showError ? errorId : undefined}
        />
        <button className="wl-btn" type="submit">
          {submitLabel}
        </button>
      </form>
      {showError ? (
        <p className="wl-err" id={errorId} role="alert">
          {validation.error}
        </p>
      ) : proof ? (
        <p className="wl-proof">{proof}</p>
      ) : null}
    </>
  );
}
