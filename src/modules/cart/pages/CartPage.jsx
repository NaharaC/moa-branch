import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  Truck,
  ShieldCheck,
  Sparkles,
  PackageCheck,
} from "lucide-react";
import { useCartContext } from "../../../context/cart-context.js";
import { Price } from "../../../components/data-display/Price.jsx";
import { DEFAULT_PLACEHOLDER_IMAGE } from "../../../config/constants.js";
import { resolveProductPrice } from "../../products/utils/products.js";
import { API_PATHS } from "../../../config/api-paths.js";
import {
  Badge,
  buttonClasses,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from "../../../components/shadcn/ui/index.js";

const buildItemImage = (item) =>
  item?.imgUrl ?? item?.image ?? item?.gallery?.[0] ?? DEFAULT_PLACEHOLDER_IMAGE;

const getItemKey = (item, index) =>
  item?.id ?? item?.slug ?? item?.name ?? `cart-item-${index}`;

const shippingOptions = [
  { value: "standard", label: "Despacho estándar", detail: "48-72 h hábiles", cost: 0 },
  { value: "express", label: "Despacho express", detail: "24 h hábiles", cost: 6900 },
  { value: "pickup", label: "Retiro en showroom", detail: "Disponible hoy", cost: 0 },
];

const guarantees = [
  {
    icon: Truck,
    title: "Logística boutique",
    copy: "Coordinamos envíos cuidados en Santiago y regiones.",
  },
  {
    icon: ShieldCheck,
    title: "Piezas certificadas",
    copy: "Cada objeto va con seguro y certificado de autenticidad.",
  },
  {
    icon: Sparkles,
    title: "Styling incluido",
    copy: "Te asesoramos para que combine perfecto en tu espacio.",
  },
];

export const CartPage = () => {
  const { cartItems, total, updateQuantity, removeFromCart, clearCart } = useCartContext();
  const [shippingMethod, setShippingMethod] = useState(shippingOptions[0].value);

  const hasItems = cartItems.length > 0;

  const activeShipping = useMemo(
    () => shippingOptions.find((option) => option.value === shippingMethod) ?? shippingOptions[0],
    [shippingMethod]
  );

  const shippingCost = hasItems ? activeShipping.cost : 0;
  const grandTotal = total + shippingCost;

  const handleQuantity = (itemId, amount) => {
    const current = Number(
      cartItems.find((item) => item.id === itemId)?.quantity ?? 1
    );
    const nextValue = Math.max(1, current + amount);
    updateQuantity(itemId, nextValue);
  };

  return (
    <main className="page container-px mx-auto max-w-6xl py-12">
      <header className="mb-10 space-y-4">
        <Badge variant="accent" className="bg-[var(--color-primary3)] text-[var(--color-text-on-dark)]">
          Carro curado
        </Badge>
        <div>
          <h1 className="title-serif text-4xl text-[var(--color-primary1)]">
            {hasItems ? "Revise tu selección" : "Tu carrito aún no tiene tesoros"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--color-text-secondary)]">
            Guardamos tus elecciones favoritas para que puedas finalizar la compra con calma.
            Coordina el envío boutique o prográmalo para retiro en nuestro showroom.
          </p>
        </div>
      </header>

      {hasItems ? (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div>
                  <CardTitle>Piezas seleccionadas</CardTitle>
                  <CardDescription>
                    {cartItems.length} producto{cartItems.length === 1 ? "" : "s"} listos para envío
                  </CardDescription>
                </div>
                <Badge variant="neutral" className="text-[var(--color-primary2)]">
                  Curado MOA
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item, index) => {
                  const itemPrice = resolveProductPrice(item) ?? 0;
                  const quantity = Number(item.quantity) || 1;
                  const itemTotal = itemPrice * quantity;

                  return (
                    <article
                      key={getItemKey(item, index)}
                      className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-white/80 p-4 shadow-[var(--shadow-sm)]"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                        <div className="flex flex-1 gap-4">
                          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-[#44311417]">
                            <img
                              src={buildItemImage(item)}
                              alt={item.name ?? "Producto"}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="space-y-1">
                            <p className="font-display text-lg text-[var(--color-primary2)]">{item.name}</p>
                            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-text-muted)]">
                              SKU {item.sku ?? "—"}
                            </p>
                            {item?.collection && (
                              <Badge className="mt-2 text-[0.6rem] tracking-[0.4em]">
                                {item.collection}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <Separator className="sm:hidden" />

                        <div className="flex flex-1 flex-col gap-3">
                          <div className="flex items-center justify-between text-sm text-[var(--color-text-muted)]">
                            <span>Precio unidad</span>
                            <Price value={itemPrice} className="font-semibold text-[var(--color-primary2)]" />
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/60 px-2 py-1">
                              <button
                                type="button"
                                onClick={() => handleQuantity(item.id, -1)}
                                className={buttonClasses({
                                  variant: "ghost",
                                  size: "icon",
                                  className: "h-9 w-9 text-[var(--color-primary2)]",
                                })}
                                aria-label={`Disminuir cantidad de ${item.name}`}
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="min-w-[32px] text-center font-semibold">{quantity}</span>
                              <button
                                type="button"
                                onClick={() => handleQuantity(item.id, 1)}
                                className={buttonClasses({
                                  variant: "ghost",
                                  size: "icon",
                                  className: "h-9 w-9 text-[var(--color-primary2)]",
                                })}
                                aria-label={`Aumentar cantidad de ${item.name}`}
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className={buttonClasses({
                                variant: "ghost",
                                size: "sm",
                                className: "gap-2 text-[0.6rem] uppercase tracking-[0.4em]",
                              })}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Quitar
                            </button>
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-[var(--color-text-muted)]">Subtotal pieza</span>
                            <Price value={itemTotal} className="text-base font-semibold text-[var(--color-primary1)]" />
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <div className="flex w-full items-center justify-between text-sm text-[var(--color-text-muted)]">
                  <span>Total carro</span>
                  <Price value={total} className="text-lg font-semibold text-[var(--color-primary1)]" />
                </div>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--color-text-muted)] transition hover:text-[var(--color-primary1)]"
                >
                  Vaciar carrito
                </button>
              </CardFooter>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              {guarantees.map(({ icon, title, copy }) => {
                const IconComponent = icon;
                return (
                  <Card key={title} className="bg-white/70 p-4 shadow-none">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-[var(--color-primary4)]/70 p-2 text-[var(--color-primary1)]">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--color-primary2)]">{title}</p>
                        <p className="text-xs text-[var(--color-text-secondary)]">{copy}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          <aside className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen de compra</CardTitle>
                <CardDescription>Define el tipo de entrega y revisa el total final.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label required>Método de entrega</Label>
                  <Select value={shippingMethod} onValueChange={setShippingMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el método" />
                    </SelectTrigger>
                    <SelectContent>
                      {shippingOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} textValue={option.label}>
                          <div className="flex flex-col">
                            <span className="font-semibold text-[var(--color-primary2)]">{option.label}</span>
                            <span className="text-xs text-[var(--color-text-muted)]">{option.detail}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-[var(--radius-xl)] bg-[var(--color-lightest)] p-4 text-sm text-[var(--color-text-secondary)]">
                  <div className="flex items-center gap-3">
                    <PackageCheck className="h-5 w-5 text-[var(--color-primary1)]" />
                    <div>
                      <p className="font-semibold text-[var(--color-primary2)]">
                        {activeShipping.label}
                      </p>
                      <p>{activeShipping.detail}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between text-[var(--color-text-muted)]">
                    <span>Subtotal</span>
                    <Price value={total} />
                  </div>
                  <div className="flex items-center justify-between text-[var(--color-text-muted)]">
                    <span>Envío</span>
                    {shippingCost ? (
                      <Price value={shippingCost} className="text-[var(--color-primary2)]" />
                    ) : (
                      <Badge variant="accent" className="text-[0.6rem] tracking-[0.3em]">
                        Gratis
                      </Badge>
                    )}
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-base font-semibold text-[var(--color-primary1)]">
                    <span>Total</span>
                    <Price value={grandTotal} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Link
                  to="/checkout"
                  className={buttonClasses({
                    size: "lg",
                    className: "w-full justify-center text-base",
                  })}
                >
                  Continuar al checkout
                </Link>
                <Link
                  to={API_PATHS.products.products}
                  className={buttonClasses({
                    variant: "outline",
                    size: "md",
                    className: "w-full justify-center",
                  })}
                >
                  Seguir explorando
                </Link>
              </CardFooter>
            </Card>
          </aside>
        </div>
      ) : (
        <Card className="flex flex-col items-center gap-6 border-dashed py-16 text-center">
          <div className="rounded-full bg-[var(--color-primary4)]/70 p-6 text-[var(--color-primary1)]">
            <ShoppingCart className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-[var(--color-primary2)]">Tu carrito está vacío</h2>
            <p className="text-sm text-[var(--color-text-secondary)] max-w-md">
              Explora las colecciones MOA, guarda tus favoritos y podrás retomar el checkout cuando
              quieras.
            </p>
          </div>
          <Link
            to={API_PATHS.products.products}
            className={buttonClasses({
              variant: "ghost",
              size: "md",
              className: "text-[var(--color-primary1)]",
            })}
          >
            Comenzar a explorar
          </Link>
        </Card>
      )}
    </main>
  );
};
