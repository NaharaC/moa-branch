import { Link } from "react-router-dom";
import Card from "./Card.jsx";
import { DEFAULT_PLACEHOLDER_IMAGE } from "../../../config/constants.js";

const normalizeWishlistProduct = (product, index) => {
  if (!product || typeof product !== "object") {
    return {
      id: `wishlist-${index}`,
      name: `Producto ${index + 1}`,
      price: 0,
      img: DEFAULT_PLACEHOLDER_IMAGE,
    };
  }

  const priceCents =
    product.precio_cents ??
    product.price_cents ??
    product.price ??
    0;

  const price = Number(priceCents) / 100;

  return {
    id: product.producto_id ?? product.id ?? product.slug ?? `wishlist-${index}`,
    name: product.nombre ?? product.name ?? product.slug ?? `Producto ${index + 1}`,
    price: Number.isFinite(price) ? price : 0,
    img:
      product.img_url ??
      product.img ??
      product.imgUrl ??
      product.gallery?.[0] ??
      DEFAULT_PLACEHOLDER_IMAGE,
  };
};

const WishlistSection = ({ products = [], isLoading = false, error = null }) => {
  const sample = (Array.isArray(products) ? products : [])
    .slice(0, 4)
    .map(normalizeWishlistProduct);

  const hasItems = sample.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="font-italiana text-2xl text-dark mt-24 mb-10 flex justify-center">
        Mis Favoritos
      </h2>

      {isLoading && (
        <p className="text-center text-sm text-dark/70">Cargando favoritos...</p>
      )}

      {!isLoading && error && (
        <p role="alert" className="text-center text-sm text-red-600">
          No pudimos cargar tus favoritos. Intenta nuevamente.
        </p>
      )}

      {!isLoading && !error && hasItems ? (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {sample.map((product) => (
            <Card key={product.id} data={product} noHover/>
          ))}
        </div>
      ) : null}

      {!isLoading && !error && !hasItems && (
        <div className="rounded-xl border border-dashed border-primary2/40 bg-white/60 p-8 text-center text-sm text-dark/70">
          Aún no tienes productos guardados.
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <Link
          type="button"
          className="rounded border border-primary2 px-6 py-2 text-primary2 transition-colors hover:bg-primary2 hover:text-white"
          to="/wishlist"
        >
          Ver más
        </Link>
      </div>
    </div>
  );
};

export default WishlistSection;

