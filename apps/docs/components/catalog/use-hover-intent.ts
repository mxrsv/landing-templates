"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface HoverIntent {
  /** true sau khi con trỏ ở lại quá `delay` ms (lướt qua không kích hoạt). */
  active: boolean;
  bind: {
    onPointerEnter: () => void;
    onPointerLeave: () => void;
  };
}

/**
 * Hover-intent: chỉ báo `active` khi con trỏ DỪNG trên element quá `delay` ms,
 * tránh mount live khi user chỉ lướt chuột qua nhiều card (ADR-0001 §2.3).
 */
export function useHoverIntent(delay = 150): HoverIntent {
  const [active, setActive] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => {
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const onPointerEnter = useCallback(() => {
    clear();
    timer.current = setTimeout(() => setActive(true), delay);
  }, [clear, delay]);

  const onPointerLeave = useCallback(() => {
    clear();
    setActive(false);
  }, [clear]);

  useEffect(() => clear, [clear]);

  return { active, bind: { onPointerEnter, onPointerLeave } };
}
