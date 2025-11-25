import { useState, useEffect } from "react";
import { useAuth } from "../../../context/auth-context.js";
import { apiClient } from "@/services/api-client.js";

const UserInfoSection = () => {
  const { user, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
  });

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    apiClient.private
      .get(`/usuario/${user.id}`)
      .then((res) => {
        setForm({
          nombre: res?.nombre ?? "",
          email: res?.email ?? "",
          telefono: res?.telefono ?? "",
        });
      })
      .catch((err) => console.error("Error cargando usuario:", err));
  }, [isAuthenticated, user?.id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveClick = async () => {
    try {
      const res = await apiClient.private.patch(`/usuario/${user.id}`, {
        nombre: form.nombre,
        telefono: form.telefono,
      });

      const updated = res?.user ?? res;

      setForm({
        nombre: updated.nombre ?? "",
        email: updated.email ?? "",
        telefono: updated.telefono ?? "",
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Error PATCH usuario:", error);
    }
  };

  return (
    <section>
      <h2 className="font-italiana text-4xl text-dark mt-24 mb-10 flex justify-center">
        Mi Perfil
      </h2>

      <div className="flex justify-center gap-4">
        <div className="w-1/3 profile-image flex justify-center">
          <i className="fa-solid fa-user text-8xl"></i>
        </div>

        <div className="w-1/3">
          <h2 className="text-2xl mb-4">@{form.nombre}</h2>

          <form className="flex flex-col gap-2">
            <input
              type="text"
              name="nombre"
              disabled={!isEditing}
              value={form.nombre}
              onChange={handleChange}
              className="w-full border border-primary2 rounded px-4 py-2"
            />

            <input
              type="email"
              name="email"
              disabled
              value={form.email}
              className="w-full border border-primary2 rounded px-4 py-2 bg-gray-100"
            />

            <input
              type="tel"
              name="telefono"
              disabled={!isEditing}
              value={form.telefono}
              onChange={handleChange}
              className="w-full border border-primary2 rounded px-4 py-2"
            />

            <div className="flex justify-between gap-2 mt-4">
              <button
                type="button"
                className="w-1/2 px-4 py-2 border border-primary2 text-primary2 rounded"
                onClick={() => setIsEditing(true)}
              >
                Editar
              </button>

              <button
                type="button"
                className={`w-1/2 px-4 py-2 border border-primary2 rounded ${
                  isEditing
                    ? "text-primary2 hover:bg-primary2 hover:text-white"
                    : "opacity-50 cursor-not-allowed"
                }`}
                onClick={handleSaveClick}
                disabled={!isEditing}
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UserInfoSection;


