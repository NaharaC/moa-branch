/* PRODUCTOS */
export const PRODUCT_STATUS_MAP = {
  activo:      { variant: "success", label: "Activo" },
  sin_stock:   { variant: "warning", label: "Sin stock" },
  borrador:    { variant: "neutral", label: "Borrador" },
  archivado:   { variant: "neutral", label: "Archivado" },
};

/* PEDIDOS */
export const ORDER_STATUS_MAP = {
  fulfilled:   { variant: "success", label: "Completada" },
  pending:     { variant: "warning", label: "Pendiente" },
  cancelled:   { variant: "error",   label: "Cancelada" },
  processing:  { variant: "info",    label: "Procesando" },
};

/* PAGOS */
export const PAYMENT_STATUS_MAP = {
  captured:    { variant: "success", label: "Pagado" },
  failed:      { variant: "error",   label: "Fallido" },
  pending:     { variant: "warning", label: "Pendiente" },
  refunded:    { variant: "info",    label: "Reembolsado" },
};

/* ENVÍOS */
export const SHIPMENT_STATUS_MAP = {
  delivered:   { variant: "success", label: "Entregado" },
  in_transit:  { variant: "info",    label: "En tránsito" },
  delayed:     { variant: "warning", label: "Retrasado" },
  cancelled:   { variant: "error",   label: "Cancelado" },
  processing:  { variant: "info",    label: "Procesando" },
  preparing:   { variant: "info",    label: "Preparando" },
};

/* USUARIOS */
export const USER_STATUS_MAP = {
  activo:      { variant: "success", label: "Activo" },
  suspendido:  { variant: "error",   label: "Suspendido" },
  eliminado:   { variant: "neutral", label: "Eliminado" },
};
