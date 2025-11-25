import { ShoppingCart, Menu, User, X, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context.js";
import { SearchBar } from "../ui/SearchBar.jsx";
import { API_PATHS } from "../../config/api-paths.js";

const NAV_ITEMS = [
  {
    label: "Inicio",
    href: API_PATHS.home.landing,
    match: ["/", API_PATHS.home.landing],
  },
  { label: "Categorías", href: API_PATHS.products.categories },
  { label: "Productos", href: API_PATHS.products.products },
  { label: "Contacto", href: API_PATHS.support.contact },
];

const getPathname = (href = "") => {
  if (!href) return "/";
  const [path] = href.split("#");
  return path || "/";
};

export function Navbar({ onNavigate, cartItemCount = 0 }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout } = useAuth();

  useEffect(() => {
    if (!location.hash) return;
    const targetId = location.hash.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

  const isActive = (item) => {
    const targets = Array.isArray(item.match)
      ? item.match
      : [item.match ?? getPathname(item.href)];
    return targets.some((target) => {
      if (!target) return false;
      if (target === "/") {
        return location.pathname === "/" || location.pathname === "/home";
      }
      return (
        location.pathname === target ||
        location.pathname.startsWith(`${target}/`)
      );
    });
  };

  const handleNavigate = (page) => {
    onNavigate?.(page);
    setIsMenuOpen(false);
  };

  const handleToggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
    setIsMenuOpen(false);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    navigate(
      `${API_PATHS.products.products}?search=${encodeURIComponent(trimmed)}`
    );
    handleNavigate("products");
    setIsSearchOpen(false);
  };

  const handleSearchChange = (event) => setSearchQuery(event.target.value);

  return (
    <>
      <div className="nav-container shadow-md fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b animate-slide-down">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Brand */}
            <Link
              to={API_PATHS.home.landing}
              className="cursor-pointer transition-transform hover:scale-105"
              aria-label="Ir al inicio"
              onClick={() => handleNavigate("home")}
            >
              <div className="brand">MOA</div>
            </Link>

            {/* Nav desktop */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item);
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setIsMenuOpen(false)}
                    className={[
                      "nav-items",
                      active
                        ? "text-(--color-secondary1) underline underline-offset-4"
                        : "",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Acciones / Iconos (derecha) */}
            <div className="flex items-center gap-2">
              {/* No logeado (desktop) */}
              {!isAuthenticated && (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    to={API_PATHS.auth.register}
                    className="nav-items nav-btn"
                  >
                    Registrarme
                  </Link>
                  <Link
                    to={API_PATHS.auth.login}
                    className="nav-items nav-btn nav-btn-primary"
                  >
                    Iniciar sesión
                  </Link>
                </div>
              )}

              {/* Logeado */}
              {isAuthenticated && (
                <>
                  {isAdmin ? (
                    // ADMIN: acceso directo al dashboard
                    <Link
                      aria-label="Dashboard admin"
                      to={API_PATHS.admin.dashboard}
                      className="nav-btn nav-btn-primary"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    // USER: Perfil + Carrito
                    <>
                      <Link
                        aria-label="Perfil"
                        to={API_PATHS.auth.profile}
                        className="nav-icon-bg transition-all hover:scale-105 active:scale-95 relative"
                      >
                        <User className="nav-icon" />
                      </Link>

                      <Link
                        aria-label="Ver carrito"
                        to="/cart"
                        className="nav-icon-bg transition-all hover:scale-105 active:scale-95 relative"
                      >
                        <ShoppingCart className="nav-icon" />
                        {cartItemCount > 0 && (
                          <span className="cart-badge absolute">
                            {cartItemCount}
                          </span>
                        )}
                      </Link>
                    </>
                  )}

                  {/* Logout */}
                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                    className="hidden md:inline nav-items nav-btn"
                  >
                    Salir
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={handleToggleSearch}
                className="nav-icon-bg transition-all hover:scale-105 active:scale-95"
                aria-label={isSearchOpen ? "Cerrar buscador" : "Abrir buscador"}
              >
                <Search className="nav-icon" />
              </button>

              {/* Toggle menú móvil */}
              <button
                aria-label="Abrir menú"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                onClick={() => setIsMenuOpen((v) => !v)}
                className="md:hidden nav-icon-bg transition-colors"
              >
                {isMenuOpen ? (
                  <X className="nav-icon" />
                ) : (
                  <Menu className="nav-icon" />
                )}
              </button>
            </div>
          </div>

          {/* Menú móvil */}
          <nav
            id="mobile-menu"
            className={[
              "md:hidden overflow-hidden transition-[max-height,opacity] duration-300",
              isMenuOpen
                ? "max-h-64 opacity-100 mt-4 pb-4"
                : "max-h-0 opacity-0",
            ].join(" ")}
          >
            <div className="flex flex-col gap-4 items-stretch px-2">
              {/* Enlaces principales */}
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="nav-items"
                  aria-current={isActive(item) ? "page" : undefined}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Bloque auth en móvil */}
              {!isAuthenticated ? (
                // No logeado
                <div className="flex flex-col gap-3 w-full animate-fade-in-up">
                  <div className="divider-horizontal my-2" />
                  <div className="grid grid-cols-2 gap-3 w-full">
                    <Link
                      to={API_PATHS.auth.register}
                      className="nav-btn text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Registrarme
                    </Link>
                    <Link
                      to={API_PATHS.auth.login}
                      className="nav-btn nav-btn-primary text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Iniciar sesión
                    </Link>
                  </div>
                </div>
              ) : (
                // Logeado
                <div className="flex items-center justify-between gap-3 animate-fade-in-up">
                  {isAdmin ? (
                    <Link
                      to={API_PATHS.admin.dashboard}
                      className="nav-btn nav-btn-primary w-full text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        to={API_PATHS.auth.profile}
                        className="nav-icon-bg"
                        onClick={() => setIsMenuOpen(false)}
                        aria-label="Perfil"
                      >
                        <User className="nav-icon" />
                      </Link>
                      <Link
                        to="/cart"
                        className="nav-icon-bg relative"
                        onClick={() => setIsMenuOpen(false)}
                        aria-label="Ver carrito"
                      >
                        <ShoppingCart className="nav-icon" />
                        {cartItemCount > 0 && (
                          <span className="cart-badge absolute">
                            {cartItemCount}
                          </span>
                        )}
                      </Link>
                      <button
                        className="nav-btn"
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                      >
                        Salir
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
      <SearchBar
        isOpen={isSearchOpen}
        value={searchQuery}
        onChange={handleSearchChange}
        onSubmit={handleSearchSubmit}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
