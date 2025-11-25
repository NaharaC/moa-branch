import { useNavigate } from "react-router-dom";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#E6E0D8] text-center p-8">
      <h1 className="text-5xl font-bold text-[#443114] mb-4">
        Página no encontrada
      </h1>
      <p className="text-[#453F34] text-lg mb-8 max-w-md">
        Lo sentimos, no pudimos encontrar lo que buscabas.
      </p>

      <button
        onClick={() => navigate("/")}
        className="bg-[#443114] text-[#E6E0D8] px-6 py-3 rounded-xl text-lg font-medium shadow-md hover:bg-[#453F34] transition-all duration-300"
      >
        Volver al inicio
      </button>
    </main>
  );
};
