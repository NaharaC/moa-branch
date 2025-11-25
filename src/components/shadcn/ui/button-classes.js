import { cn } from "@/utils/cn.js";

const variantClasses = {
  default:
    "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-sm)] hover:bg-[var(--color-hover)]",
  outline:
    "border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--muted)]/60",
  ghost:
    "bg-transparent text-[var(--color-primary1)] hover:bg-[var(--color-primary4)]/60 hover:text-[var(--color-primary1)]",
  subtle:
    "bg-[var(--color-primary4)]/80 text-[var(--color-primary1)] shadow-none hover:bg-[var(--color-primary4)]",
  destructive:
    "bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:bg-[var(--color-error)]",
};

const sizeClasses = {
  sm: "h-9 rounded-full px-3 text-xs",
  md: "h-11 rounded-full px-5 text-sm",
  lg: "h-12 rounded-full px-6 text-base",
  icon: "h-11 w-11 rounded-full",
};

export const buttonClasses = ({ variant = "default", size = "md", className } = {}) =>
  cn(
    "inline-flex items-center justify-center whitespace-nowrap font-semibold tracking-tight transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50",
    variantClasses[variant] ?? variantClasses.default,
    sizeClasses[size] ?? sizeClasses.md,
    className
  );

