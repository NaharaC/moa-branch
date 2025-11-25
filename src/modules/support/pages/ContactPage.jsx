import React from 'react';
import { Button } from '../../../components/ui/Button'
import Swal from 'sweetalert2';

export default function ContactPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');

    Swal.fire({
      title: 'Mensaje enviado',
      text: `Gracias, ${name || '😊'} — hemos recibido tu mensaje.`,
      icon: 'success',
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#5c4526',
    });

    e.target.reset();
  };

  return (
    <main className="page min-h-screen bg-[#f4efe9] text-(--color-primary1)">
      <section className="py-20 px-6 md:px-16 lg:px-32 grid md:grid-cols-2 gap-12 items-stretch">

        <div className="hidden md:flex h-full max-h-[600px] overflow-hidden rounded-xl bg-[#44311417]">
          <img
            src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxib29rbWFya3MtcGFnZXwyMDR8fHxlbnwwfHx8fHw%3D&auto=format&fit=crop"
            alt="Ambiente cálido con detalles naturales"
            className="object-cover h-full w-full"
          />
        </div>

        <div className="flex flex-col justify-center h-full max-h-[600px]">
          <h1 className="text-5xl font-serif tracking-tight mb-6">Contacto</h1>
          <p className="text-base mb-8">
            ¿Tienes una consulta o deseas una cotización personalizada? Escríbenos y nuestro equipo te responderá a la brevedad.
          </p>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1 text-(--color-secondary1)">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Tu nombre completo"
                className="text-sm text-(--color-primary1) w-full  bg-white/75  rounded-lg p-3 focus:ring-2 focus:ring-(--color-secondary2) outline-none"
                required
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1 text-(--color-secondary1)">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="tu@email.com"
                className="text-sm w-full rounded-lg p-3 bg-white/75 focus:ring-2 focus:ring-(--color-secondary2) outline-none"
                required
              />
            </div>
            <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1 text-(--color-secondary1)">
                Mensaje
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="Cuéntanos en qué podemos ayudarte..."
                className="text-sm w-full  rounded-lg p-3  bg-white/75  focus:ring-2 focus:ring-(--color-secondary2)  outline-none"
                required
              ></textarea>
            </div>
            <Button
              type="submit"
              shape="pill"
              size="lg"
              motion="lift"
            >
              Enviar mensaje
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
