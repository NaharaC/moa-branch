import Card from "../components/Card.jsx";
import { useProducts } from "../../products/hooks/useProducts.js";
import { useWishlist } from "../../profile/hooks/useWishlist.js";

const WISHLIST_PRODUCT_FILTERS = Object.freeze({ limit: 100 });

export const WishlistPage = () => {
  const {
    products = [],
    isLoading: isLoadingProducts,
    error: productsError,
  } = useProducts(WISHLIST_PRODUCT_FILTERS);

  const { wishlist, isLoading: isLoadingWishlist } = useWishlist();

  const wishlistProducts = products.filter((product) =>
    wishlist.some(
      (item) =>
        item.producto_id === product.id ||
        item.id === product.id 
    )
  );

  const isLoading = isLoadingProducts || isLoadingWishlist;
  const error = productsError;

  return (
    <main className="px-4 py-10">
      <h1 className="font-italiana text-4xl text-dark mt-14 mb-8 flex justify-center">
        Wishlist
      </h1>

      {isLoading && (
        <p className="text-center text-sm text-dark/70">
          Cargando tus favoritos...
        </p>
      )}

      {!isLoading && error && (
        <p role="alert" className="text-center text-sm text-red-600">
          No pudimos cargar tus favoritos. Intenta nuevamente.
        </p>
      )}

      {!isLoading && !error && wishlistProducts.length === 0 && (
        <div className="rounded-xl border border-dashed border-primary2/40 bg-white/60 p-8 text-center text-sm text-dark/70">
          Aún no tienes productos guardados.
        </div>
      )}

      {!isLoading && !error && wishlistProducts.length > 0 && (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {wishlistProducts.map((product) => (
            <Card key={product.id ?? product.slug} data={product} noHover/>
          ))}
        </div>
      )}
    </main>
  );
};

