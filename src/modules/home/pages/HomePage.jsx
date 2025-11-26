import ContactSection from "../components/ContactSection.jsx";
import HeroSection from "../components/HeroSection.jsx";
import ProductsSection from "../components/ProductsSection.jsx";
import { useHomeLanding } from "../hooks/useHomeLanding.js";

export const HomePage = () => {
  const { home, isLoading, error } = useHomeLanding();

  const categories = home?.categories ?? undefined;
  const featuredProducts = home?.featuredProducts ?? undefined;

  return (
    <div className="page">
      <HeroSection />

      <div className="px-4 sm:px-6">
        <section className="py-12">
          <div className="container-px mx-auto max-w-7xl">
            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                No pudimos cargar los productos. Intenta nuevamente en unos minutos.
              </div>
            )}
            <ProductsSection categories={categories} products={featuredProducts} />
            {isLoading && (
              <div className="mt-6 text-center text-sm text-neutral-500">
                Cargando piezas curadas para ti…
              </div>
            )}
          </div>
        </section>

        <ContactSection contact={home?.contact} />
      </div>
    </div>
  );
};
