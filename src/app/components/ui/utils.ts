/**
 * ui/utils.ts
 * Small utility helpers for className composition used across UI components.
 * - `cn` merges Tailwind class strings and resolves conflicts via
 *   `clsx` + `tailwind-merge` (`twMerge`).
 * Usage: `className={cn('p-4', isActive && 'bg-blue-500')}`
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
