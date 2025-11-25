import { API_PATHS } from '../config/api-paths.js';

export const ROUTES = {
  home: '/',
  landing: API_PATHS.home.landing,
  categories: API_PATHS.products.categories,
  products: API_PATHS.products.products,
  productDetail: (id) => API_PATHS.products.productDetail(id),
  auth: {
    login: API_PATHS.auth.login,
    register: API_PATHS.auth.register,
    forgot: API_PATHS.auth.forgot,
    reset: API_PATHS.auth.reset,
    profile: API_PATHS.auth.profile,
  },
  support: {
    contact: API_PATHS.support.contact,
    faq: API_PATHS.support.faq,
    privacy: API_PATHS.support.privacy,
    terms: API_PATHS.support.terms,
  },
  wishlist: API_PATHS.wishlist.root(':userId'),
  cart: API_PATHS.cart.root(':userId'),
  checkout: API_PATHS.cart.checkout(':userId'),
  admin: {
    dashboard: API_PATHS.admin.dashboard,
    products: API_PATHS.admin.products,
    collections: API_PATHS.admin.collections,
    orders: API_PATHS.admin.orders,
    customers: API_PATHS.admin.customers,
    settings: API_PATHS.admin.settings,
  },
};
