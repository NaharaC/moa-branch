import React from "react";
import Pill from "./Pill.jsx";
import {
  PRODUCT_STATUS_MAP,
  ORDER_STATUS_MAP,
  PAYMENT_STATUS_MAP,
  SHIPMENT_STATUS_MAP,
  USER_STATUS_MAP,
} from "../../config/status-maps.js";

/* domain = "product" | "order" | "payment" | "shipment" | "user" */
const DOMAIN_MAP = {
  product: PRODUCT_STATUS_MAP,
  order: ORDER_STATUS_MAP,
  payment: PAYMENT_STATUS_MAP,
  shipment: SHIPMENT_STATUS_MAP,
  user: USER_STATUS_MAP,
};

export function StatusPill({ status, domain = "order", className = "" }) {
  if (!status) return <Pill variant="neutral">-</Pill>;

  const map = DOMAIN_MAP[domain] ?? {};
  const key = String(status).toLowerCase();

  const conf = map[key] ?? { variant: "neutral", label: key };

  return (
    <Pill variant={conf.variant} className={className}>
      {conf.label}
    </Pill>
  );
}
