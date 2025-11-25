import React from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import AdminStatsCard from "../components/AdminStatsCard";
import AdminTable from "../components/AdminTable";
import AdminActionButton from "../components/AdminActionButton";

// Vista principal del Dashboard Admin
export default function AdminDashboard() {
  // Datos de ejemplo para las tarjetas de estadísticas
  const stats = [
    { title: "Total Usuarios", value: "1,234", icon: "👥" },
    { title: "Total Productos", value: "567", icon: "📦" },
    { title: "Ventas Hoy", value: "$12,345", icon: "💰" },
    { title: "Órdenes Pendientes", value: "89", icon: "🛒" },
  ];

  // Datos de ejemplo para la tabla
  const tableColumns = ["ID", "Usuario", "Email", "Estado", "Acciones"];
  const tableData = [
    { ID: "1", Usuario: "Juan Pérez", Email: "juan@example.com", Estado: "Activo", Acciones: "Ver" },
    { ID: "2", Usuario: "María López", Email: "maria@example.com", Estado: "Activo", Acciones: "Ver" },
    { ID: "3", Usuario: "Carlos García", Email: "carlos@example.com", Estado: "Inactivo", Acciones: "Ver" },
    { ID: "4", Usuario: "Ana Martínez", Email: "ana@example.com", Estado: "Activo", Acciones: "Ver" },
  ];

  return (
    <div className="flex h-screen bg-moa-neutral-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader />

        {/* Área de contenido con scroll */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* Grid de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <AdminStatsCard
                key={idx}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
              />
            ))}
          </div>

          {/* Sección de acciones rápidas */}
          <div className="bg-white rounded-lg shadow p-6 mb-8 border border-moa-neutral-200">
            <h2 className="text-xl font-bold text-moa-neutral-900 mb-4">Acciones Rápidas</h2>
            <div className="flex flex-wrap gap-4">
              <AdminActionButton onClick={() => alert("Crear Usuario")}>
                Crear Usuario
              </AdminActionButton>
              <AdminActionButton onClick={() => alert("Agregar Producto")}>
                Agregar Producto
              </AdminActionButton>
              <AdminActionButton onClick={() => alert("Nueva Categoría")}>
                Nueva Categoría
              </AdminActionButton>
              <AdminActionButton onClick={() => alert("Ver Reportes")}>
                Ver Reportes
              </AdminActionButton>
            </div>
          </div>

          {/* Tabla de usuarios recientes */}
          <div className="bg-white rounded-lg shadow p-6 border border-moa-neutral-200">
            <h2 className="text-xl font-bold text-moa-neutral-900 mb-4">Usuarios Recientes</h2>
            <AdminTable columns={tableColumns} data={tableData} />
          </div>
        </main>
      </div>
    </div>
  );
}
