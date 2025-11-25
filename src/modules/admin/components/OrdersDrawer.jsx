import React from "react";
import { Dialog, DialogContent } from "../../../components/ui/radix/Dialog.jsx";
import { Price } from "../../../components/data-display/Price.jsx";
import { StatusPill } from "../../../components/ui/StatusPill.jsx";
import { Pill } from "../../../components/ui/Pill.jsx";
import { formatDate_ddMMyyyy } from "../../../utils/date.js";
import { CalendarDays, PackageCheck, Truck } from "lucide-react";

// Helpers pequeños para no ensuciar el JSX
const safeDate = (value) => (value ? formatDate_ddMMyyyy(value) : "–");
const safeText = (v) => (v == null || v === "" ? "–" : v);

export default function OrdersDrawer({ open, order, onClose }) {
  // Si no hay orden seleccionada, no mostramos nada
  if (!open || !order) return null;

  const {
    number,
    status,
    createdAt,
    items = [],
    payment,
    shipment,
    address,
    userName,
    userEmail,
    userPhone,
    subtotal,
    shipping,
    total,
  } = order;

  // Fallbacks simples para evitar undefined
  const paymentMethod = payment?.provider ?? payment?.method ?? "—";
  const deliveryService = shipment?.carrier ?? "—";
  const shippingStatus = shipment?.status ?? "—";
  const deliveredAt = shipment?.deliveredAt ?? null;
  const shippedAt = shipment?.shippedAt ?? null;
  const tracking = shipment?.trackingNumero ?? shipment?.trackingNumber ?? null;
  // Link de tracking se removió por solicitud; mantenemos sólo el número.
  const fullAddress = address
    ? [
        address.street,
        [address.commune, address.city].filter(Boolean).join(", "),
        [address.region, address.country].filter(Boolean).join(", "),
        address.postalCode,
      ]
        .filter(Boolean)
        .join(" · ")
    : null;

  // Stepper helpers -----------------------------------------------------------------------------------------------
  const shippingCurrentStep = (() => {
    if (shipment?.status === "cancelled" || status === "cancelled") return 0;
    if (deliveredAt) return 2;
    if (shippedAt || shipment?.status === "in_transit" || shipment?.status === "processing" || shipment?.status === "preparing") return 1;
    return 0; // creada
  })();

  const steps = [
    { key: "created", label: "Creada", date: createdAt, icon: CalendarDays },
    { key: "shipped", label: "Enviada", date: shippedAt, icon: Truck },
    { key: "delivered", label: "Entregada", date: deliveredAt, icon: PackageCheck },
  ];

  // Micro description list rows (menos cajas, mejor legibilidad)
  const Dl = ({ children, className = "" }) => (
    <dl className={`divide-(--color-border) ${className}`}>{children}</dl>
  );
  const DlRow = ({ label, children }) => (
    <div className="grid grid-cols-3 gap-3 py-2">
      <dt className="col-span-1 text-[11px] uppercase tracking-wide text-(--color-text-muted)">{label}</dt>
      <dd className="col-span-2 text-sm leading-6">{children}</dd>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        variant="drawer"
        placement="right"
        className="w-full max-w-[720px]"
        showClose={true}
      >
        <div className="flex h-full flex-col bg-(--color-neutral2) text-(--color-text)">
        {/* Header (sticky) */}
  <header className="sticky top-0 z-10 flex items-center justify-between border-b border-(--color-border) bg-white/90 px-7 py-5 backdrop-blur">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wide text-(--color-text-muted)">
              Orden
            </p>
            <h2 className="mt-0.5 truncate font-mono text-lg font-semibold tracking-tight text-primary">
              {number ?? "Orden"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Delivery date quick glance */}
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-(--color-border) bg-(--surface-subtle) px-3 py-1.5 text-sm text-(--color-text)">
              <CalendarDays className="h-4 w-4 text-(--color-text-muted)" />
              <span className="whitespace-nowrap">
                {deliveredAt ? `Entrega: ${safeDate(deliveredAt)}` : shippedAt ? `Envío: ${safeDate(shippedAt)}` : "Sin fecha"}
              </span>
            </div>
            <div className="flex flex-col items-end gap-1 text-right">
              <span className="text-xs text-(--color-text-muted)">Estado</span>
              <StatusPill status={status} />
            </div>
          </div>
        </header>

        {/* Contenido scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Secciones en acordeón */}
          <Accordion
            className="divide-y divide-(--color-border) rounded-2xl border border-(--color-border) bg-white shadow-sm"
            sections={[
              {
                key: "summary",
                title: "Resumen de la orden",
                defaultOpen: true,
                render: () => (
                  <div className="space-y-3">
                    <div className="divide-y divide-(--color-border) rounded-lg border border-(--color-border)">
                      {items.length === 0 && (
                        <div className="px-4 py-3 text-sm text-(--color-text-muted)">Esta orden no tiene ítems.</div>
                      )}
                      {items.map((item, idx) => {
                        return (
                          <div key={idx} className="flex items-center gap-3 px-4 py-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-(--color-neutral3) text-xs text-(--color-text-muted)">
                              {item.name?.[0] ?? "?"}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">{safeText(item.name)}</p>
                              <p className="text-xs text-(--color-text-muted)">{item.quantity ?? 1} uds</p>
                            </div>
                            <div className="text-right text-sm font-medium tabular-nums">
                              <Price value={item.unitPrice ?? 0} />
                            </div>
                          </div>
                        );
                      })}
                      <div className="flex items-center justify-between">
                        <span className="text-(--color-text-muted)">Envío</span>
                        <span className="tabular-nums"><Price value={shipping ?? 0} /></span>
                      </div>
                      <div className="mt-2 flex items-center justify-between border-t border-(--color-border) pt-2 font-medium">
                        <span>Total</span>
                        <span className="tabular-nums"><Price value={total ?? payment?.amount ?? 0} /></span>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                key: "customer",
                title: "Cliente",
                render: () => (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-(--color-text-muted)">Nombre</p>
                      <p className="mt-0.5 text-sm">{safeText(userName)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-(--color-text-muted)">Email</p>
                      <p className="mt-0.5 break-all text-sm text-(--color-primary1)">{safeText(userEmail)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-(--color-text-muted)">Teléfono</p>
                      <p className="mt-0.5 text-sm">{safeText(userPhone)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-(--color-text-muted)">Método de pago</p>
                      <p className="mt-0.5 text-sm">{safeText(paymentMethod)}</p>
                    </div>
                  </div>
                ),
              },
              {
                key: "delivery",
                title: "Envío y entrega",
                render: () => (
                  <div className="space-y-4 text-sm">
                    {/* Stepper */}
                    <div className="relative">
                      <ol className="flex items-center justify-between gap-2">
                        {steps.map((s, idx) => {
                          const active = idx <= shippingCurrentStep;
                          const Icon = s.icon;
                          return (
                            <li key={s.key} className="flex min-w-0 flex-1 flex-col items-center">
                              <div className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-medium ${active ? "bg-(--color-primary1) text-white border-(--color-primary1)" : "bg-white text-(--color-text-muted) border-(--color-border)"}`}>
                                <Icon className={`h-4 w-4 ${active ? "text-white" : "text-(--color-text-muted)"}`} />
                              </div>
                              <span className={`mt-1 text-[12px] ${active ? "text-(--color-primary1)" : "text-(--color-text-muted)"}`}>{s.label}</span>
                              <span className="mt-0.5 text-[10px] text-(--color-text-muted)">{safeDate(s.date)}</span>
                            </li>
                          );
                        })}
                      </ol>
                      {/* progress line */}
                      <div className="pointer-events-none absolute left-[calc(2rem-2px)] right-[calc(2rem-2px)] top-4 h-0.5 bg-(--color-border)">
                        <div
                          className="h-full bg-(--color-primary1) transition-all"
                          style={{ width: `${(shippingCurrentStep / (steps.length - 1)) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Panel resumen de envío */}
                    <div className="rounded-lg border border-(--color-border) bg-white/70 p-3">
                      <div className="flex items-start gap-3">
                        <Truck className="mt-0.5 h-4 w-4 text-(--color-text-muted)" />
                        <div className="min-w-0">
                          <p className="font-medium">{safeText(deliveryService)}</p>
                          <div className="mt-0.5">
                            <Pill variant={deliveredAt ? "success" : shippingStatus === "cancelled" ? "error" : "info"}>
                              {safeText(shippingStatus)}
                            </Pill>
                          </div>
                          {tracking && (
                            <p className="mt-1 text-xs text-(--color-text-muted)">Tracking: <span className="font-mono">{tracking}</span></p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-md border border-(--color-border) bg-white px-3 py-2">
                        <p className="text-[11px] uppercase tracking-wide text-(--color-text-muted)">Fecha de envío</p>
                        <p className="mt-0.5">{safeDate(shippedAt)}</p>
                      </div>
                      <div className="rounded-md border border-(--color-border) bg-white px-3 py-2">
                        <p className="text-[11px] uppercase tracking-wide text-(--color-text-muted)">Fecha de entrega</p>
                        <p className="mt-0.5">{safeDate(deliveredAt)}</p>
                      </div>
                      <div className="rounded-md border border-(--color-border) bg-white px-3 py-2 sm:col-span-2">
                        <p className="text-[11px] uppercase tracking-wide text-(--color-text-muted)">Dirección de envío {address?.label ? `(${address.label})` : ""}</p>
                        <p className="mt-0.5 wrap-break-word">{fullAddress ?? "–"}</p>
                      </div>
                    </div>
                  </div>
                ),
              },
            ]}
          />

            {/* Col derecha: Meta (envío / cliente / pago) */}
            <aside className="md:col-span-4">
              {/* Envío y entrega */}
              <section className="mb-8">
                <h3 className="mb-3 text-sm font-semibold">Envío y entrega</h3>
                {/* Stepper */}
                <div className="relative">
                  <ol className="flex items-center justify-between gap-2">
                    {steps.map((s, idx) => {
                      const active = idx <= shippingCurrentStep;
                      const Icon = s.icon;
                      return (
                        <li key={s.key} className="flex min-w-0 flex-1 flex-col items-center">
                          <div className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] ${active ? "bg-(--color-primary1) text-white border-(--color-primary1)" : "bg-white text-(--color-text-muted) border-(--color-border)"}`}>
                            <Icon className={`h-4 w-4 ${active ? "text-white" : "text-(--color-text-muted)"}`} />
                          </div>
                          <span className={`mt-1 text-[11px] ${active ? "text-(--color-primary1)" : "text-(--color-text-muted)"}`}>{s.label}</span>
                          <span className="mt-0.5 text-[10px] text-(--color-text-muted)">{safeDate(s.date)}</span>
                        </li>
                      );
                    })}
                  </ol>
                  <div className="pointer-events-none absolute left-[calc(1.75rem)] right-[calc(1.75rem)] top-3 h-px bg-(--color-border)">
                    <div className="h-full bg-(--color-primary1) transition-all" style={{ width: `${(shippingCurrentStep / (steps.length - 1)) * 100}%` }} />
                  </div>
                </div>

                {/* Datos de envío (lista simple) */}
                <Dl className="mt-4">
                  <DlRow label="Carrier">
                    <span className="font-medium">{safeText(deliveryService)}</span>
                    <span className="ml-2 align-middle"><Pill variant={deliveredAt ? "success" : shippingStatus === "cancelled" ? "error" : "info"}>{safeText(shippingStatus)}</Pill></span>
                  </DlRow>
                  {tracking && (
                    <DlRow label="Tracking"><span className="font-mono text-[13px] text-(--color-text-muted)">{tracking}</span></DlRow>
                  )}
                  <DlRow label="Fecha de envío">{safeDate(shippedAt)}</DlRow>
                  <DlRow label="Fecha de entrega">{safeDate(deliveredAt)}</DlRow>
                  <DlRow label={`Dirección${address?.label ? ` (${address.label})` : ""}`}>
                    <span className="break-words">{fullAddress ?? "–"}</span>
                  </DlRow>
                </Dl>
              </section>

              {/* Cliente */}
              <section className="mb-8">
                <h3 className="mb-3 text-sm font-semibold">Cliente</h3>
                <Dl>
                  <DlRow label="Nombre">{safeText(userName)}</DlRow>
                  <DlRow label="Email"><span className="text-(--color-primary1)">{safeText(userEmail)}</span></DlRow>
                  <DlRow label="Teléfono">{safeText(userPhone)}</DlRow>
                </Dl>
              </section>

              {/* Pago */}
              <section>
                <h3 className="mb-3 text-sm font-semibold">Pago</h3>
                <Dl>
                  <DlRow label="Método">{safeText(paymentMethod)}</DlRow>
                  {payment?.status && (
                    <DlRow label="Estado">
                      <Pill variant={payment.status === "captured" ? "success" : payment.status === "failed" ? "error" : "info"}>{payment.status}</Pill>
                    </DlRow>
                  )}
                </Dl>
              </section>
            </aside>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
