import { Link } from "react-router-dom";
import { API_PATHS } from "../../../config/api-paths.js";

const backgroundImageUrl =
  "https://images.unsplash.com/photo-1650370363832-c6a735a7abf0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative mx-auto w-full max-w-7xl px-10 py-0  mb-15"
    >
      <div className="relative w-full max-w-7xl overflow-hidden rounded-lg">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("${backgroundImageUrl}")`,
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
          }}
        />
        <div className="absolute inset-0 bg-[rgba(60,45,27,0.5)]" />
        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-6 rounded-3xl px-8 py-12 text-center text-white">
          <p className="text-xs uppercase tracking-[0.5em] text-white">
            Conecta con nosotros
          </p>
          <h2 className="font-display text-4xl leading-tight text-white sm:text-5xl">
            ¿Listo para tu próximo proyecto?
          </h2>
          <p className="text-sm text-white sm:text-base">
            Cuéntanos qué necesitas: estamos atentos para coordinar una llamada,
            brindar asesoría o preparar una muestra especialmente pensada para ti.
          </p>
          <Link to={API_PATHS.support.contact}
            className="inline-flex items-center rounded-full border border-white/70 bg-white px-8 py-3 text-base font-semibold text-black transition hover:bg-white/90">
            Escríbenos →
          </Link>
        </div>
      </div>
    </section>
  );
}
