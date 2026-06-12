"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import type { ComponentPropsWithoutRef } from "react";

/** Root — controlled/uncontrolled via Radix (keyboard + aria handled). */
export const Tabs = TabsPrimitive.Root;

export function TabsList({
  className,
  ...rest
}: ComponentPropsWithoutRef<typeof TabsPrimitive.List>) {
  const classes = [
    "flex items-center gap-px border-b border-[var(--border-default)]",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return <TabsPrimitive.List className={classes} {...rest} />;
}

export function TabsTrigger({
  className,
  ...rest
}: ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) {
  const classes = [
    "px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-caption)]",
    "text-[var(--tab-inactive-fg)] border-b-2 border-transparent -mb-px cursor-pointer",
    "transition-[color,border-color] duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
    "hover:text-[var(--tab-active-fg)]",
    "data-[state=active]:text-[var(--tab-active-fg)] data-[state=active]:border-[var(--tab-indicator)]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--state-focus-ring)]",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return <TabsPrimitive.Trigger className={classes} {...rest} />;
}

export function TabsContent({
  className,
  ...rest
}: ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) {
  const classes = ["focus-visible:outline-none", className]
    .filter(Boolean)
    .join(" ");
  return <TabsPrimitive.Content className={classes} {...rest} />;
}
