import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Simple utility function for combining class names
export function combineClasses(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
} 