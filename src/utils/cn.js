import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Minimal `cn` helper similar to the one bundled with shadcn/ui.
 * Useful to compose Tailwind classes while respecting repo tokens.
 */
export const cn = (...inputs) => twMerge(clsx(inputs));

