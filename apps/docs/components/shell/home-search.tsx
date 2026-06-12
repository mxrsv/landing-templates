"use client";

import { Input } from "@landing/ui/components/input";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Search trên home — ⌘K focus, Enter điều hướng `/sections?q=...`
 * (URL = source of truth, kết quả filter render trên server).
 */
export function HomeSearch() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  const handleSubmit = () => {
    const q = query.trim();
    router.push(
      q.length > 0 ? `/sections?q=${encodeURIComponent(q)}` : "/sections",
    );
  };

  return (
    <Input
      ref={inputRef}
      type="search"
      placeholder="Tìm section, template…"
      shortcutHint="⌘K"
      value={query}
      onChange={(event) => setQuery(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === "Enter") handleSubmit();
      }}
      aria-label="Tìm kiếm trong catalog"
      className="w-full max-w-[var(--container-sm)]"
    />
  );
}
