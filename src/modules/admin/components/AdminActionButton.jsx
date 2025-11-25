import React from "react";

// Botón de acción para dashboard admin
export default function AdminActionButton({ children, ...props }) {
  return (
    <button
      className="bg-moa-primary text-white px-4 py-2 rounded shadow hover:bg-moa-primary-dark transition font-semibold"
      {...props}
    >
      {children}
    </button>
  );
}
