import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Minus, X, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "../../../components/ui/Button.jsx";
import { Price } from "../../../components/data-display/Price.jsx";

import { useCartContext } from "../../../context/cart-context.js";

import { resolveProductPrice } from "../../products/utils/products.js";
import { DEFAULT_PLACEHOLDER_IMAGE } from "../../../config/constants.js";
import { API_PATHS } from "../../../config/api-paths.js";

const buildItemImage = (item) =>
  item?.imgUrl ?? item?.image ?? item?.gallery?.[0] ?? DEFAULT_PLACEHOLDER_IMAGE;

const getItemKey = (item, index) =>
  item?.id ?? item?.slug ?? item?.name ?? `cart-item-${index}`;

export const CartDrawer = () => {
  const {
    cartItems,
    total,
    removeFromCart,
    updateQuantity,
    clearCart,
    isDrawerOpen,
    closeDrawer,
  } = useCartContext();

  const hasItems = cartItems.length > 0;

  const quantityLabel = useMemo(() => {
    if (!hasItems) return "Tu carrito está vacío";
    return `${cartItems.length} producto${cartItems.length === 1 ? "" : "s"}`;
  }, [cartItems.length, hasItems]);

  return (
    <div
      aria-hidden={!isDrawerOpen}
      className={`fixed inset-0 z-[1200] flex transition duration-300 ${
        isDrawerOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        onClick={closeDrawer}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          isDrawerOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        className={`relative ml-auto flex w-full max-w-sm flex-col rounded-tl-3xl bg-[var(--color-lightest)] p-6 shadow-[0_20px_45px_rgba(17,24,39,0.35)] transition-transform duration-300 transform ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-start justify-between gap-4">
          <div>
            <h2 className=" text-2xl font-semibold text-[var(--color-primary1)]">
              Carrito
            </h2>
            <p className="text-xs font-semibold text-neutral-500">{quantityLabel}</p>
          </div>
          <button
            type="button"
            aria-label="Cerrar carrito"
            onClick={closeDrawer}
            className="rounded-full border border-neutral-200 p-2 text-neutral-600 transition hover:border-neutral-300 hover:text-neutral-900"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <section className="mt-6 flex flex-1 flex-col gap-6 overflow-y-auto pr-1">
          {hasItems ? (
            cartItems.map((item, index) => {
              const itemPrice = resolveProductPrice(item) ?? 0;
              const itemTotal = itemPrice * (Number(item.quantity) || 1);
              return (
                <article
                  key={getItemKey(item, index)}
                  className="flex gap-3 rounded-2xl border border-neutral-200 bg-white/80 p-3 shadow-[0_4px_18px_rgba(0,0,0,0.05)]"
                >
                  <div className="h-20 w-20 rounded-2xl bg-[#44311417]">
                    <img
                      src={buildItemImage(item)}
                      alt={item.name ?? "Producto"}
                      className="h-full w-full rounded-2xl object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">{item.name}</p>
                      <div className="text-xs text-neutral-500">
                        Precio unidad: <Price value={itemPrice} className="text-neutral-500" />
                      </div>
                      <div className="text-sm font-semibold text-neutral-900">
                        Total: <Price value={itemTotal} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 text-sm">
                      <div className="flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-2 py-1">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, (Number(item.quantity) || 1) - 1)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-600 transition hover:text-primary1"
                          aria-label={`Disminuir cantidad de ${item.name}`}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="mx-2 min-w-[26px] text-center font-semibold">
                          {item.quantity ?? 1}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, (Number(item.quantity) || 1) + 1)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-600 transition hover:text-primary1"
                          aria-label={`Aumentar cantidad de ${item.name}`}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500 transition hover:text-primary1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-neutral-200 bg-white/80 p-6 text-center">
              <ShoppingCart className="h-10 w-10 text-neutral-400" />
              <p className="text-sm font-semibold text-neutral-700">
                Aún no agregas ningún producto.
              </p>
              <Link
                to={API_PATHS.products.products}
                onClick={closeDrawer}
                className="text-sm font-semibold text-primary1 underline"
              >
                Explorar productos
              </Link>
            </div>
          )}
        </section>

        <footer className="mt-6 flex flex-col gap-4">
          <div className="flex items-center justify-between border-t border-neutral-200 pt-4 text-sm">
            <span className="text-neutral-500">Subtotal</span>
            <Price value={total} className="text-lg font-semibold text-[var(--color-primary1)]" />
          </div>

          <div className="flex flex-col gap-3">
            <Button
              to="/cart"
              appearance="ghost"
              intent="primary"
              size="md"
              width="full"
              onClick={closeDrawer}
            >
              Ver carrito completo
            </Button>
            <Button
              to="/checkout"
              size="md"
              width="full"
              onClick={closeDrawer}
            >
              Ir al checkout
            </Button>
          </div>

          {hasItems && (
            <button
              type="button"
              onClick={clearCart}
              className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500 transition hover:text-primary1"
            >
              Vaciar carrito
            </button>
          )}
        </footer>
      </aside>
    </div>
  );
};
