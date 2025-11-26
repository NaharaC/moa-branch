export const API_PATHS = {
  home: {
    landing: "/home",
  },
  auth: {
    login: "/login",
    register: "/registro",
    profile: "/auth/perfil",
    forgot: "/auth/olvidaste-contrasena",
    reset: "/auth/restablecer-contrasena",
  },
  products: {
    products: "/productos",
    productDetail: (id) => `/producto/${id}`,
    categories: "/categorias",
    collections: "/colecciones",
  },

  cart: {
    root: () => "/cart",
    checkout: (userId) => `/${userId}/checkout`,

    // 🔥 AGREGADO (no borra nada)
    add: () => "/cart/add",
    remove: (id) => `/cart/remove/${id}`,
    update: () => "/cart/update",
    clear: () => "/cart/clear",
  },

  profile: {
    root: (userId) => `/${userId}/perfil`,
  },
  orders: {
    root: (userId) => `/${userId}/mis-pedidos`,
    detail: (userId, orderId) => `/${userId}/mis-pedidos/${orderId}`,
  },
  wishlist: {
    root: (userId) => `/${userId}/wishlist`,
  },
  support: {
    contact: "/contacto",
    faq: "/preguntas-frecuentes",
    privacy: "/politica-de-privacidad",
    terms: "/terminos-y-condiciones",
  },
  admin: {
    dashboard: "/admin",
    products: "/admin/productos",
    newProduct: "/admin/productos/nuevo",
    orders: "/admin/pedidos",
    customers: "/admin/clientes",
    settings: "/admin/configuraciones",
    collections: "/admin/colecciones",
    uiDemo: "/admin",
    test: "/admin/test",
  },
};
