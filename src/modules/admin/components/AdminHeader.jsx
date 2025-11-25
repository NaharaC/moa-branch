import React from "react";

// Header/topbar para dashboard admin
export default function AdminHeader() {
  return (
    <header className="bg-moa-primary text-white px-8 py-4 flex items-center justify-between shadow">
      <h1 className="text-2xl font-bold text-primary">Panel de Administración</h1>
      <div className="flex items-center gap-4">
        <span className="font-medium">admin@moa.com</span>
        <button className="bg-moa-neutral-200 text-moa-primary px-3 py-1 rounded hover:bg-moa-neutral-300">Salir</button>
      </div>
    </header>
  );
}
