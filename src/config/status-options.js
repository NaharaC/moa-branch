import {
  PRODUCT_STATUS_MAP,
  ORDER_STATUS_MAP,
  PAYMENT_STATUS_MAP,
  SHIPMENT_STATUS_MAP,
  USER_STATUS_MAP,
} from "./status-maps.js";

/**
 * STATUS_MAP pasa a ser un array de opciones para <select> o filtros.
 * @param {Object} statusMap - Mapa de estados { key: { variant, label } }
 * @param {boolean} includeAll - Si incluir la opción "Todos" al inicio
 * @returns {Array<{value: string, label: string}>}
 */
function mapToOptions(statusMap, includeAll = true) {
  const entries = Object.entries(statusMap).map(([value, config]) => ({
    value,
    label: config.label,
  }));

  return includeAll
    ? [{ value: "", label: "Todos" }, ...entries]
    : entries;
}

// Opciones de producto
export const PRODUCT_STATUS_OPTIONS = mapToOptions(PRODUCT_STATUS_MAP);

// Opciones de orden/pedido
export const ORDER_STATUS_OPTIONS = mapToOptions(ORDER_STATUS_MAP);

// Opciones de pago
export const PAYMENT_STATUS_OPTIONS = mapToOptions(PAYMENT_STATUS_MAP);

// Opciones de envío
export const SHIPMENT_STATUS_OPTIONS = mapToOptions(SHIPMENT_STATUS_MAP);

// Opciones de usuario
export const USER_STATUS_OPTIONS = mapToOptions(USER_STATUS_MAP);

//Helper Genérico
export function getStatusOptions(statusMap, includeAll = true) {
  return mapToOptions(statusMap, includeAll);
}
