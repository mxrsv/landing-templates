import assert from "node:assert/strict";
import { test } from "node:test";
import { validateEmail } from "./waitlist-email.ts";

test("accepts a well-formed email", () => {
  const result = validateEmail("a@b.co");
  assert.equal(result.ok, true);
  assert.equal(result.error, undefined);
});

test("rejects a malformed email with an error message", () => {
  const result = validateEmail("x");
  assert.equal(result.ok, false);
  assert.equal(typeof result.error, "string");
  assert.ok((result.error ?? "").length > 0);
});

test("rejects an empty string with an error message", () => {
  const result = validateEmail("");
  assert.equal(result.ok, false);
  assert.ok((result.error ?? "").length > 0);
});

test("treats a whitespace-only value as empty", () => {
  const result = validateEmail("   ");
  assert.equal(result.ok, false);
  assert.ok((result.error ?? "").length > 0);
});

test("trims surrounding whitespace before validating", () => {
  const result = validateEmail("  a@b.co  ");
  assert.equal(result.ok, true);
  assert.equal(result.error, undefined);
});
