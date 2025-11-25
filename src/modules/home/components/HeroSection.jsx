import { API_PATHS } from "../../../config/api-paths.js";

const NAVBAR_HEIGHT = 80; // px

export default function HeroSection() {
  return (
    <section
      className="relative w-full overflow-hidden bg-[#44311417]"
      style={{ paddingTop: `${NAVBAR_HEIGHT}px`, marginTop: `-${NAVBAR_HEIGHT}px` }}
    >
      <img
        src="https://images.unsplash.com/photo-1578500494198-246f612d3b3d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8MjB8fHxlbnwwfHx8fHw%3D&auto=format&fit=crop&q=60&w=900"
        alt=""
        className="absolute inset-0 top-0 h-full w-full object-cover"
        loading="eager"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            linear-gradient(
              0deg,
              color-mix(in srgb, var(--color-light, #100e08) 100%, transparent) 0%,
              color-mix(in srgb, var(--color-secondary2, #443114) 30%, transparent) 35%,
              color-mix(in srgb, var(--color-secondary2, #a69f91) 5%, transparent) 100%
            )
          `,
        }}
        aria-hidden
      />

      <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-6 pt-80 pb-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-12">
        <div className="flex flex-col gap-6">
          <h1 className="title-display text-4xl text-white sm:text-5xl leading-none">
            Diseño hecho a medida para espacios conscientes
          </h1>
        

          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href={`${API_PATHS.products.products}?collection=coleccion-atelier`}
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 font-garamond text-base tracking-wide text-neutral-900 transition hover:bg-neutral-100"
            >
              Explorar nueva colección
            </a>
            
          </div>
        </div>

        <div className="hidden lg:block" />
      </div>
    </section>
  );
}
