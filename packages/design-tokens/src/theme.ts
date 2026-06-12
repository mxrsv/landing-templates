/**
 * Theme mood identity for @landing/design-tokens.
 *
 * The matching CSS lives in `./themes/<mood>.css`, each overriding only the
 * `--p-*` palette (+ motion personality) under `[data-theme="<mood>"]`.
 * Spacing/type floor stays in `base.css` and is never theme-dependent.
 */

export const THEME_MOODS = ["infra", "neon", "game", "nft"] as const;

export type ThemeMood = (typeof THEME_MOODS)[number];

export const DEFAULT_THEME: ThemeMood = "infra";

/**
 * Gallery-shell-only neutral frame ("Warm graphite"). Deliberately NOT in
 * `THEME_MOODS`: pieces never carry it, so it stays out of catalog filters,
 * `resolveTheme`, and `pieceMeta.mood`.
 */
export const CHROME_THEME = "chrome" as const;

/** Every `data-theme` value that exists in CSS (moods + chrome frame). */
export type ThemeName = ThemeMood | typeof CHROME_THEME;

/**
 * Type guard: is `value` one of the known theme moods?
 * Narrows to `ThemeMood` so callers avoid an unsafe `as` cast.
 */
export function isThemeMood(value: unknown): value is ThemeMood {
  return (
    typeof value === "string" &&
    (THEME_MOODS as readonly string[]).includes(value)
  );
}

/**
 * Narrow an untrusted value (URL param, attribute, props) to a valid
 * `ThemeMood`, falling back to `infra` for anything invalid.
 */
export function resolveTheme(value: string | null | undefined): ThemeMood {
  return isThemeMood(value) ? value : DEFAULT_THEME;
}
