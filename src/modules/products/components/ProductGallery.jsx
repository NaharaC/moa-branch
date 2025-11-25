import ProductCard from "./ProductCard.jsx";
import { useWishlist } from "../../profile/hooks/useWishlist.js";
import { useCartContext } from "@/context/cart-context.js";
import { useAuth } from "@/context/auth-context.js";

export default function ProductGallery({ products = [] }) {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCartContext();
  const { token } = useAuth();

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white/70 p-6 text-center text-sm text-(--text-weak)">
        No hay productos que coincidan con los filtros seleccionados.
      </div>
    );
  }

  return (
    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => {
        const isSaved = wishlist.some(
          (item) =>
            item.producto_id === product.id || item.id === product.id
        );

        const handleWishlist = () => {
          if (!token) {
            alert("Debes iniciar sesión para usar la wishlist");
            return false; // Muy importante → bloquea el ProductCard
          }
          toggleWishlist(product);
          return true;
        };

        const handleAddToCart = () => {
          if (!token) {
            alert("Debes iniciar sesión para usar el carrito");
            return;
          }
          addToCart(product);
        };

        return (
          <ProductCard
            key={product.id}
            product={product}
            isInWishlist={isSaved}
            onToggleWishlist={handleWishlist}
            onAddToCart={handleAddToCart}
          />
        );
      })}
    </section>
  );
}




