import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { Breadcrumbs } from "../../../components/layout/Breadcrumbs.jsx";
import { Accordion } from "../../../components/ui/Accordion.jsx";
import { Price } from "../../../components/data-display/Price.jsx";

import { productsApi } from "../../../services/products.api.js";
import { DEFAULT_PLACEHOLDER_IMAGE } from "../../../config/constants.js";
import { useCategories } from "../hooks/useCategories.js";
import { API_PATHS } from "../../../config/api-paths.js";
import { Minus, Plus, Recycle, ShieldCheck, Truck } from "lucide-react";
import { useCartContext } from "../../../context/cart-context.js";

const initialState = {
  product: null,
  isLoading: true,
  error: null,
};

const formatDimensions = (dimensions) => {
  if (!dimensions) return null;
  const { width, length, height, unit = "cm" } = dimensions;
  const measures = [width, length, height].filter((value) => value !== undefined && value !== null);
  if (!measures.length) return null;
  if (measures.length === 3) {
    return `${width} × ${length} × ${height} ${unit}`;
  }
  return `${measures.join(" × ")} ${unit}`;
};

const formatWeight = (weight) => {
  if (!weight) return null;
  if (weight.value === undefined || weight.value === null) return null;
  return `${weight.value} ${weight.unit ?? "kg"}`;
};

const normalizeGallery = (product) => {
  const base = [
    product?.imgUrl ?? null,
    ...(Array.isArray(product?.gallery) ? product.gallery : []),
  ].filter(Boolean);
  if (!base.length) return [DEFAULT_PLACEHOLDER_IMAGE];
  return Array.from(new Set(base));
};

const ProductMediaGallery = ({ images, selectedImage, onSelect }) => {
  if (!images.length) return null;

  return (
    <div className="grid gap-4 lg:grid-cols-[96px_1fr]">
      {/* Thumbnails */}
      <div className="hidden lg:flex lg:flex-col lg:gap-3">
        {images.map((src) => (
          <button
            key={src}
            type="button"
            onClick={() => onSelect?.(src)}
            className={`aspect-square overflow-hidden rounded-2xl border transition ${
              selectedImage === src
                ? "border-(--color-primary1) ring-2 ring-(--color-primary1)/30"
                : "border-(--border-subtle) hover:border-(--color-primary1)"
            }`}
            aria-label="Ver imagen"
          >
            <img src={src} alt="miniatura producto" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      {/* Imagen principal */}
      <div className="overflow-hidden rounded-[32px] bg-[#44311417] min-h-[28rem] md:min-h-[36rem] lg:min-h-[42rem]">
        <img src={selectedImage} alt="Producto" className="h-full w-full object-cover" />
      </div>

      {/* Thumbnails móviles */}
      <div className="mt-2 flex gap-3 overflow-x-auto lg:hidden">
        {images.map((src) => (
          <button
            key={src}
            type="button"
            onClick={() => onSelect?.(src)}
            className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border transition ${
              selectedImage === src ? "border-(--color-primary1)" : "border-(--border-subtle)"
            }`}
            aria-label="Ver imagen"
          >
            <img src={src} alt="miniatura producto" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};


export const ProductDetailPage = () => {
  const { id } = useParams();
  const { categories } = useCategories();
  const [state, setState] = useState(initialState);
  const [selectedImage, setSelectedImage] = useState(DEFAULT_PLACEHOLDER_IMAGE);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, updateQuantity } = useCartContext() ?? {};
  const productsBasePath = API_PATHS.products.products;

  const baseBreadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: "Productos", href: productsBasePath },
  ];

  useEffect(() => {
    if (!id) {
      setState({ product: null, isLoading: false, error: new Error("Producto no encontrado") });
      return;
    }

    let cancelled = false;
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    productsApi
      .getById(id)
      .then((product) => {
        if (cancelled) return;
        setState({ product, isLoading: false, error: null });
      })
      .catch((error) => {
        if (cancelled) return;
        setState({ product: null, isLoading: false, error });
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const product = state.product;
  const categoryBreadcrumb = useMemo(() => {
    if (!product) return null;
    const candidateId =
      product.fk_category_id ?? product.categoryId ?? product.category?.id ?? null;
    const match =
      candidateId !== null
        ? categories.find((category) => String(category.id) === String(candidateId))
        : null;
    if (match) {
      const param = match.slug ?? match.id ?? candidateId;
      const href = param
        ? `${productsBasePath}?category=${encodeURIComponent(param)}`
        : productsBasePath;
      return {
        label: match.name ?? "Categoría",
        href,
      };
    }
    if (product.collection) {
      return {
        label: product.collection,
        href: productsBasePath,
      };
    }
    return null;
  }, [product, categories, productsBasePath]);

  const galleryImages = useMemo(() => normalizeGallery(product), [product]);

  useEffect(() => {
    if (!galleryImages.length) return;
    setSelectedImage(galleryImages[0]);
  }, [galleryImages]);

  const materialList = useMemo(() => {
    if (!product) return [];
    const materials = Array.isArray(product.materials) ? product.materials : [];
    if (materials.length) return materials.filter(Boolean);
    if (product.material) return [product.material];
    return [];
  }, [product]);

  const specEntries = useMemo(() => {
    if (!product) return [];
    const specs = product.specs;
    if (!specs || typeof specs !== "object" || Array.isArray(specs)) return [];
    return Object.entries(specs);
  }, [product]);

  const highlights = [
    {
      icon: <Truck className="size-4" aria-hidden />,
      label: "Despacho rápido",
      description: "48-72 h dentro de la RM. Regiones vía transporte asociado.",
    },
    {
      icon: <ShieldCheck className="size-4" aria-hidden />,
      label: "Garantía MOA",
      description: "18 meses contra defectos de fabricación.",
    },
    {
      icon: <Recycle className="size-4" aria-hidden />,
      label: "Materiales responsables",
      description: materialList.length ? materialList.join(" · ") : "Selección sustentable certificada.",
    },
  ];

  const sections = [
    {
      title: "Descripción",
      content: product?.description ?? "Producto MOA diseñado para acompañar tus espacios.",
      defaultOpen: true,
    },
    {
      title: "Materiales y cuidado",
      content:
        materialList.length > 0
          ? `Fabricado en ${materialList.join(
              ", ",
            )}. Limpiar con paño seco y evitar exposición directa y prolongada al sol o humedad.`
          : "Recomendamos limpieza suave con paño seco y proteger de la luz solar directa.",
    },
    {
      title: "Medidas y especificaciones",
      content: (
        <ul className="space-y-2">
          {product?.dimensions && (
            <li>
              <span className="font-medium text-neutral-800">Dimensiones:&nbsp;</span>
              <span>{formatDimensions(product.dimensions)}</span>
            </li>
          )}
          {product?.weight && (
            <li>
              <span className="font-medium text-neutral-800">Peso:&nbsp;</span>
              <span>{formatWeight(product.weight)}</span>
            </li>
          )}
          {specEntries.map(([key, value]) => (
            <li key={key}>
              <span className="font-medium text-neutral-800">{key}:&nbsp;</span>
              <span>{value}</span>
            </li>
          ))}
          {specEntries.length === 0 && (
            <li>Consultar ficha técnica para más detalles.</li>
          )}
        </ul>
      ),
    },
    {
      title: "Despachos y devoluciones",
      content:
        "Despachamos a todo Chile a través de partners logísticos. Puedes solicitar devolución dentro de los 10 días siguientes a la entrega si el producto no fue usado y mantiene su empaque original.",
    },
  ];

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => Math.min(99, prev + 1));
  };

  if (state.isLoading) {
    return (
      <main className="page container-px mx-auto max-w-6xl py-12">
        <Breadcrumbs items={baseBreadcrumbItems} className="mb-6" />
        <div className="h-[30rem] animate-pulse rounded-[32px] bg-neutral-100" />
      </main>
    );
  }

  if (state.error || !product) {
    return (
      <main className="page container-px mx-auto max-w-6xl py-12">
        <Breadcrumbs items={baseBreadcrumbItems} className="mb-6" />
        
        <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center text-red-700">
          No encontramos el producto que estás buscando.
        </div>
      </main>
    );
  }

  const breadcrumbItems = categoryBreadcrumb
    ? [...baseBreadcrumbItems, categoryBreadcrumb]
    : baseBreadcrumbItems;

  return (
    <>
      <main className="page container-px mx-auto max-w-6xl py-10 lg:py-14">
        <div className="mb-6 text-neutral-500">
          <Breadcrumbs items={breadcrumbItems} className="text-sm font-light" />
        </div>

        <article className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,0.4fr)]">
          <div className="lg:col-span-1">
            <ProductMediaGallery
              images={galleryImages}
              selectedImage={selectedImage}
              onSelect={setSelectedImage}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              <div>
                <h1 className="title-sans text-2xl text-(--color-secondary12) sm:text-3xl">{product.name}</h1>
                <div className="mt-3 flex items-baseline gap-3">
                  <Price value={product.price} className="text-3xl font-semibold text-(--color-secondary1)" />
                  {product.compareAtPrice && (
                    <Price value={product.compareAtPrice} className="text-base text-neutral-400 line-through" />
                  )}
                </div>
                <p className="mt-1 text-sm text-(--color-secondary1)">
                  {product.stock > 0 ? "En stock" : "Sin stock"}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center justify-between rounded-full px-4 py-2 text-lg font-medium text-neutral-900 sm:w-40 border border-(--border-subtle)">
                  <button
                    type="button"
                    onClick={handleDecrease}
                    className="text-(--color-secondary1) transition hover:text-(--color-primary1)"
                    aria-label="Disminuir cantidad"
                  >
                    <Minus className="size-4" aria-hidden />
                  </button>
                  <span>{quantity}</span>
                  <button
                    type="button"
                    onClick={handleIncrease}
                    className="text-(--color-secondary1) transition hover:text-(--color-primary1)"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="size-4" aria-hidden />
                  </button>
                </div>
                <button
                  type="button"
                  disabled={product.stock <= 0}
                  onClick={() => {
                    if (!addToCart) return;
                    addToCart(product);
                    if (quantity > 1 && updateQuantity) {
                      updateQuantity(product.id, quantity);
                    }
                  }}
                  className="w-full rounded-full border border-(--color-primary1) px-6 py-2 text-base font-medium text-(--color-primary1) transition hover:bg-(--color-primary1) hover:text-(--color-light) disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
                >
                  Agregar al carrito
                </button>
              </div>

              <section className="space-y-2 border-t border-(--color-secondary2) pt-4">
                <p className="text-xs uppercase tracking-[0.25em] text-(--color-secondary1)">SKU {product.sku}</p>
                <Accordion sections={sections} />
              </section>
            </div>
          </div>
        </article>
      </main>

      <section className="w-full py-6 bg-(--color-secondary1)">
        <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-(--color-secondary2) text-sm text-(--color-light) sm:grid-cols-2 lg:grid-cols-3 sm:divide-y-0 sm:divide-x sm:divide-(--color-secondary2)">
          {highlights.map((highlight) => (
            <div
              key={highlight.label}
              className="flex flex-col gap-2 px-4 py-4"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{highlight.icon}</span>
                <p className="font-semibold">{highlight.label}</p>
              </div>
              <p>{highlight.description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};
