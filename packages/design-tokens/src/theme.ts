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
 * Narrow an untrusted value (URL param, attribute, props) to a valid
 * `ThemeMood`, falling back to `infra` for anything invalid.
 */
export function resolveTheme(value: string | null | undefined): ThemeMood {
  return (THEME_MOODS as readonly string[]).includes(value ?? "")
    ? (value as ThemeMood)
    : DEFAULT_THEME;
}
