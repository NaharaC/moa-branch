import {
  PRODUCT_STATUS_MAP,
  ORDER_STATUS_MAP,
  PAYMENT_STATUS_MAP,
  SHIPMENT_STATUS_MAP,
  USER_STATUS_MAP,
} from "../status-maps.js";

const VALID_VARIANTS = ["primary", "success", "warning", "error", "info", "neutral"];

function validateStatusMap(name, map, expectedKeys = []) {
  const errors = [];
  const keys = Object.keys(map);

  if (keys.length === 0) {
    errors.push(`${name}: map is empty`);
  }

  // Validar que cada key tenga variant y label
  for (const [key, config] of Object.entries(map)) {
    if (!config) {
      errors.push(`${name}.${key}: config is null/undefined`);
      continue;
    }
    if (!config.variant) {
      errors.push(`${name}.${key}: missing 'variant'`);
    } else if (!VALID_VARIANTS.includes(config.variant)) {
      errors.push(`${name}.${key}: invalid variant '${config.variant}'`);
    }
    if (!config.label || typeof config.label !== "string") {
      errors.push(`${name}.${key}: missing or invalid 'label'`);
    }
  }

  // Validar que estén las keys esperadas (si se especifican)
  if (expectedKeys.length > 0) {
    for (const expected of expectedKeys) {
      if (!keys.includes(expected)) {
        errors.push(`${name}: missing expected key '${expected}'`);
      }
    }
  }

  return errors;
}

function runTests() {
  const results = [];

  // PRODUCT_STATUS_MAP
  results.push(...validateStatusMap("PRODUCT_STATUS_MAP", PRODUCT_STATUS_MAP, [
    "activo",
    "sin_stock",
    "borrador",
    "archivado",
  ]));

  // ORDER_STATUS_MAP
  results.push(...validateStatusMap("ORDER_STATUS_MAP", ORDER_STATUS_MAP, [
    "fulfilled",
    "pending",
    "cancelled",
    "processing",
  ]));

  // PAYMENT_STATUS_MAP
  results.push(...validateStatusMap("PAYMENT_STATUS_MAP", PAYMENT_STATUS_MAP, [
    "captured",
    "failed",
    "pending",
    "refunded",
  ]));

  // SHIPMENT_STATUS_MAP
  results.push(...validateStatusMap("SHIPMENT_STATUS_MAP", SHIPMENT_STATUS_MAP, [
    "delivered",
    "in_transit",
    "delayed",
    "cancelled",
    "processing",
    "preparing",
  ]));

  // USER_STATUS_MAP
  results.push(...validateStatusMap("USER_STATUS_MAP", USER_STATUS_MAP, [
    "activo",
    "suspendido",
    "eliminado",
  ]));

  return results;
}

// Run validation
const errors = runTests();

if (errors.length === 0) {
  console.log("✅ All STATUS_MAPs are valid!");
  // eslint-disable-next-line no-undef
  if (typeof process !== "undefined") process.exit(0);
} else {
  console.error("❌ STATUS_MAP validation failed:");
  errors.forEach((err) => console.error(`  - ${err}`));
  // eslint-disable-next-line no-undef
  if (typeof process !== "undefined") process.exit(1);
  throw new Error("STATUS_MAP validation failed");
}
