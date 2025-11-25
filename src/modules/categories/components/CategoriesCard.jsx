import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import { API_PATHS } from "../../../config/api-paths.js";

const VARIANT_STYLES = {
  hero: {
    container: "min-h-[360px] sm:min-h-[480px]",
    title: "text-2xl sm:text-2xl",
    overlay: "from-[rgba(32,24,16,0.85)] to-[rgba(100,78,47,0.35)]",
  },
  featured: {
    container: "min-h-[260px]",
    title: "text-2xl",
    overlay: "from-[rgba(36,27,18,0.85)] to-[rgba(97,76,46,0.3)]",
  },
  default: {
    container: "min-h-[320px]",
    title: "text-2xl",
    overlay: "from-[rgba(47,37,21,0.85)] to-[rgba(127,104,69,0.20)]",
  },
};

export function CategoriesCard({ category, variant = "default" }) {
  if (!category) return null;
  const styles = VARIANT_STYLES[variant] ?? VARIANT_STYLES.default;

  const resolvedCategoryParam =
    category?.slug ?? (category?.id !== undefined ? String(category.id) : null);
  const baseProductsPath = API_PATHS.products.products;
  const targetHref = resolvedCategoryParam
    ? `${baseProductsPath}?category=${encodeURIComponent(resolvedCategoryParam)}`
    : baseProductsPath;

  return (
    <article
      className={`group relative overflow-hidden rounded-4xl bg-[#44311417] text-white shadow-xl ${styles.container}`}
    >
      <img
        src={category.coverImage}
        alt={category.name}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
      <div
        className={`pointer-events-none absolute inset-0 bg-linear-to-t ${styles.overlay} mix-blend-darken`}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-4xl bg-black/0 transition-opacity duration-300 group-hover:bg-black/10"
        aria-hidden
      />

      <div className="relative flex h-full flex-col justify-end p-6 sm:p-8">
        <div className="flex items-end justify-between gap-4">
          <div className={`font-display text-white ${styles.title}`}>{category.name}</div>
          <Link
            to={targetHref}
            className="group inline-flex h-[38px] items-center overflow-hidden rounded-full border border-white/60 px-2 py-2 text-sm font-normal text-white transition-all duration-500 ease-out hover:border-white hover:bg-white/5"
            aria-label={`Explorar ${category.name}`}
          >
            <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-normal leading-none tracking-wide opacity-0 transition-all duration-500 ease-out delay-100 group-hover:max-w-[120px] group-hover:pl-3 group-hover:text-white/90 group-hover:opacity-100">
              Ver más
            </span>
            <MoveRight
              aria-hidden
              strokeWidth={1}
              className="h-5 w-5 shrink-0 text-white transition-transform duration-500 ease-out group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default CategoriesCard;
