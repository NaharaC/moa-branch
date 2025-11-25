import { Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import { API_PATHS } from "../../config/api-paths.js";

const CUSTOMER_SERVICE_LINKS = [
  { label: "Contacto", href: API_PATHS.support.contact },
  { label: "Cambios y devoluciones", href: API_PATHS.support.privacy },
  { label: "Preguntas frecuentes", href: API_PATHS.support.faq },
];

const POLICY_LINKS = [
  { label: "Política de privacidad", href: API_PATHS.support.privacy },
  { label: "Términos y condiciones", href: API_PATHS.support.terms },
];

const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://facebook.com", icon: Facebook },
  { label: "Instagram", href: "https://instagram.com", icon: Instagram },
  { label: "Twitter", href: "https://twitter.com", icon: Twitter },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const renderColumn = (title, links = []) => (
      <section>
        <h4 className="text-base font-semibold text-neutral-800">{title}</h4>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map(({ label, href, external }) => (
          <li key={label}>
            {href ? (
              external ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-neutral-500 transition hover:text-primary1 hover:underline"
                >
                  {label}
                </a>
              ) : (
                <Link to={href} className="text-neutral-500 transition hover:text-primary1 hover:underline">
                  {label}
                </Link>
              )
            ) : (
              <span className="text-neutral-400">{label}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );

  return (
  <footer className="bg-white/75 text-sm text-neutral-600 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_repeat(3,1fr)]">
          <section>
            <Link to={API_PATHS.home.landing} aria-label="Ir al inicio" className="inline-flex">
              <span className="text-2xl text-serif tracking-tight text-secondary1">MOA</span>
            </Link>

          
            <div className="mt-6 flex gap-4">
              {SOCIAL_LINKS.map(({ label, href, icon }) => {
                const IconComponent = icon;
                return (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="group rounded-full border border-neutral-200 p-2 text-neutral-500 transition hover:border-primary1 hover:text-primary1"
                  >
                    <IconComponent className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </section>

          {renderColumn("Servicio al cliente", CUSTOMER_SERVICE_LINKS)}
        </div>

        <div className="mt-12 border-t border-neutral-200 flex flex-col gap-4 pt-6 text-xs text-neutral-500 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {POLICY_LINKS.map(({ label, href }) => (
              <Link key={label} to={href} className="hover:text-primary1 hover:underline">
                {label}
              </Link>
            ))}
          </div>
          <p>
            © {currentYear}{" "}
            <Link to="/style-guide" className="text-current no-underline focus-visible:underline">
              MOA Studio
            </Link>{" "}
            · Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
