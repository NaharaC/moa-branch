import React from "react";

// Sidebar de navegación para dashboard admin
export default function AdminSidebar() {
  return (
    <aside className="bg-moa-neutral-100 w-64 h-full p-6 flex flex-col border-r border-moa-neutral-200">
      <h2 className="text-xl font-bold mb-8 text-moa-primary">Admin Panel</h2>
      <nav className="flex flex-col gap-4">
        <a href="#" className="text-moa-neutral-700 hover:text-moa-primary font-medium">Dashboard</a>
        <a href="#" className="text-moa-neutral-700 hover:text-moa-primary font-medium">Usuarios</a>
        <a href="#" className="text-moa-neutral-700 hover:text-moa-primary font-medium">Productos</a>
        <a href="#" className="text-moa-neutral-700 hover:text-moa-primary font-medium">Categorías</a>
        <a href="#" className="text-moa-neutral-700 hover:text-moa-primary font-medium">Órdenes</a>
        <a href="#" className="text-moa-neutral-700 hover:text-moa-primary font-medium">Ajustes</a>
      </nav>
    </aside>
  );
}
