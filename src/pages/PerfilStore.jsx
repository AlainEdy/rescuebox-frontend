import React from "react";
import { useNavigate } from "react-router-dom";

export default function PerfilStore({ user, store, setUser }) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("rb_token");
    localStorage.removeItem("rb_user");
    setUser(null);
    navigate("/login"); // redirige al login
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">🏪 Perfil de {store?.nombre || "la Tienda"}</h2>

      {store ? (
        <div className="mb-4 space-y-2">
          <p><span className="font-semibold">Dirección:</span> {store.direccion}</p>
          <p><span className="font-semibold">Teléfono:</span> {store.telefono}</p>
          <p><span className="font-semibold">Descripción:</span> {store.descripcion}</p>
          <p><span className="font-semibold">Horario:</span> {store.horario}</p>
          <p><span className="font-semibold">Registrada desde:</span> {new Date(store.fecha_registro).toLocaleDateString()}</p>
        </div>
      ) : (
        <p className="text-gray-500">Cargando información de la tienda...</p>
      )}

      <button
        onClick={logout}
        className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
