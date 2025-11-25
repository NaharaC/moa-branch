import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import clsx from "clsx";

const normalizeItems = (items = []) => {
  if (!Array.isArray(items)) return [];
  return items
    .map((item, index, array) => {
      if (!item) return null;
      const label = item.label ?? item.title;
      if (!label) return null;
      const isLast = index === array.length - 1;
      const href = item.href ?? item.to ?? null;
      const isCurrent =
        item.isCurrent ?? (isLast && href === null && !item.to);
      return {
        label,
        href,
        isCurrent,
      };
    })
    .filter(Boolean);
};

export function Breadcrumbs({ items = [], className, separator }) {
  const normalized = normalizeItems(items);
  if (normalized.length === 0) return null;

  const SeparatorIcon =
    separator ??
    (
      <ChevronRight
        className="size-3.5 stroke-[2.5] text-(--text-muted,#a8a29e)"
        aria-hidden
      />
    );

  return (
    <nav
      aria-label="Ruta de navegación"
      className={clsx("ui-sans text-sm text-(--text-muted,#78716c)", className)}
    >
      <ol className="flex flex-wrap items-center gap-2">
        {normalized.map((item, index) => (
          <li key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
            {index > 0 && <span aria-hidden>{SeparatorIcon}</span>}
            {item.isCurrent || !item.href ? (
              <span className="font-semibold text-(--text-strong,#1c1917)">{item.label}</span>
            ) : (
              <Link
                to={item.href}
                className="transition-colors hover:text-(--color-primary1)"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
