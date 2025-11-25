import { createStrictContext } from "./createStrictContext.js";

// Context aislado de componentes para cumplir la regla react-refresh/only-export-components
export const [AuthContext, useAuth] = createStrictContext("Auth", {
  displayName: "AuthContext",
  errorMessage: "useAuth debe usarse dentro de AuthProvider",
});

// Utilidad: detectar rol admin con tolerancia a cambios de backend
export const isAdminRole = (user) =>
  user?.role === "admin" ||
  user?.rol === "admin" ||
  user?.role_code === "ADMIN" ||
  user?.rol_code === "ADMIN";
