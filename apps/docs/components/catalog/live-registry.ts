/**
 * Live-render singleton coordinator — đảm bảo TỐI ĐA 1 Thumbnail live/lần
 * (invariant ADR-0001). Module-level state: slug đang giữ live + hàm evict
 * để buộc nó unmount khi slug khác claim.
 *
 * Không dùng React context vì Thumbnail nằm rải rác khắp gallery — singleton
 * module đơn giản hơn và không cần provider bao ngoài.
 */
let currentSlug: string | null = null;
let currentEvict: (() => void) | null = null;

/** Giành quyền live cho `slug` — evict slug đang giữ trước (nếu khác). */
export function claimLive(slug: string, evict: () => void): void {
  if (currentSlug !== null && currentSlug !== slug) {
    currentEvict?.();
  }
  currentSlug = slug;
  currentEvict = evict;
}

/** Nhả quyền live — chỉ clear khi `slug` đúng là owner hiện tại (idempotent). */
export function releaseLive(slug: string): void {
  if (currentSlug === slug) {
    currentSlug = null;
    currentEvict = null;
  }
}
