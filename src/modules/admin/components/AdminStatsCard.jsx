import React from "react";

// Tarjeta de resumen para stats
export default function AdminStatsCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4 border border-moa-neutral-200">
      {icon && <div className="text-moa-primary text-3xl">{icon}</div>}
      <div>
        <div className="text-moa-neutral-500 text-sm font-medium">{title}</div>
        <div className="text-2xl font-bold text-moa-neutral-900">{value}</div>
      </div>
    </div>
  );
}
