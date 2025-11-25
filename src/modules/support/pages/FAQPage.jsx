import { Accordion } from "../../../components/ui/Accordion.jsx";

const FAQs = [
  {
    title: "¿Cuánto tarda en llegar mi pedido?",
    content:
      "El tiempo de entrega depende de tu ubicación. En promedio, los envíos nacionales tardan entre 5 y 10 días hábiles. Te enviaremos un número de seguimiento cuando tu pedido sea despachado.",
  },
  {
    title: "¿Puedo personalizar los muebles?",
    content:
      "Sí, ofrecemos opciones de personalización en ciertos productos como sofás, mesas y closets. Puedes elegir el color, tipo de madera o tela desde la página del producto.",
  },
  {
    title: "¿Realizan envíos a todo el país?",
    content:
      "Sí, realizamos envíos a todo el país mediante empresas de paquetería confiables. En zonas rurales, el tiempo de entrega puede ser mayor.",
  },
  {
    title: "¿Cuál es su política de devoluciones?",
    content:
      "Aceptamos devoluciones dentro de los primeros 7 días hábiles después de recibir el producto, siempre que esté en su empaque original y sin usar. Para más información, consulta nuestra política completa en la sección de Términos y Condiciones.",
  },
  {
    title: "¿Tienen garantía los muebles?",
    content:
      "Sí, todos nuestros muebles tienen garantía de 12 meses por defectos de fabricación. No cubre daños ocasionados por mal uso o modificaciones del producto.",
  },
  {
    title: "¿Cómo puedo contactar al servicio al cliente?",
    content:
      "Puedes comunicarte con nuestro equipo a través de correo electrónico. Nuestro horario de atención es de lunes a viernes de 9:00 a 18:00 hrs.",
  },
];

export const FAQPage = () => {
  return (
    <main className="max-w-3xl mx-auto p-6 pt-36 pb-20">
      <h1 className="text-3xl font-bold text-center mb-6 text-(--color-primary1)">
        Preguntas Frecuentes
      </h1>
      <section>
        <div>
          <Accordion
            className="divide-y"
            sections={FAQs.map((FAQ, index) => ({
              title: FAQ.title,
              content: FAQ.content,
              defaultOpen: index === 0,
            }))}
          />
        </div>
      </section>
    </main>
  );
};
