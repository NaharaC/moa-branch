import { useMyOrders } from "@/modules/profile/hooks/useMyOrders.js";
import Card from "./Card.jsx";
import { DEFAULT_PLACEHOLDER_IMAGE } from "../../../config/constants.js";

const normalizeOrderProduct = (item, index) => {
  if (!item) {
    return {
      id: `order-${index}`,
      name: `Producto ${index + 1}`,
      price: 0,
      img: DEFAULT_PLACEHOLDER_IMAGE,
    };
  }

  const img =
    item.img_url ??
    (Array.isArray(item.gallery) ? item.gallery[0] : null) ??
    DEFAULT_PLACEHOLDER_IMAGE;

  return {
    id: item.producto_id ?? item.id ?? `order-${index}`,
    name: item.nombre ?? `Producto ${index + 1}`,
    price: item.precio_unit ?? 0,
    img,
  };
};

export default function OrderSection() {
  const { orders, isLoading, error } = useMyOrders();

  const allItems = orders.flatMap((o) => o.items ?? []);

  const uniqueMap = new Map();
  for (const item of allItems) {
    const id = item.producto_id ?? item.product_id ?? item.id;
    if (!uniqueMap.has(id)) {
      uniqueMap.set(id, item);
    }
  }

  const uniqueItems = Array.from(uniqueMap.values());

  const recentPurchases = uniqueItems.slice(0, 4).map(normalizeOrderProduct);
  const hasPurchases = recentPurchases.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="font-italiana text-2xl text-dark mt-24 mb-10 flex justify-center">
        Mis Compras
      </h2>

      {isLoading && (
        <p className="text-center text-sm text-dark/70">
          Cargando tus compras...
        </p>
      )}

      {!isLoading && error && (
        <p className="text-center text-sm text-red-600">
          No pudimos cargar tus compras.
        </p>
      )}

      {!isLoading && !error && hasPurchases && (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 mb-20">
          {recentPurchases.map((p) => (
            <Card key={p.id} data={p} noHover />
          ))}
        </div>
      )}

      {!isLoading && !error && !hasPurchases && (
        <div className="rounded-xl border border-dashed border-primary2/40 bg-white/60 p-8 text-center text-sm text-dark/70">
          Aún no registras compras.
        </div>
      )}
    </div>
  );
}
