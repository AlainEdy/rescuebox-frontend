import React, { useEffect, useState } from "react";

export default function Carrito() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("rb_token");
    if (!token) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/reservas/mis`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setReservas(data))
      .catch((e) => console.error("Error cargando reservas:", e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-center">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">🛒 Mis reservas</h1>

      {reservas.length === 0 ? (
        <p className="text-gray-500">No tienes reservas aún.</p>
      ) : (
        <div className="space-y-4">
          {reservas.map((r) => (
            <div
              key={r.id}
              className="bg-white p-4 rounded-xl shadow border border-gray-100"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {r.box_nombre}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Tienda: {r.store_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Dirección: {r.direccion}
                  </p>
                  <p className="text-sm text-gray-500">
                    Franja: {r.franja_horaria}
                  </p>
                  <p className="text-sm text-gray-500">
                    Estado:{" "}
                    <span
                      className={`font-semibold ${
                        r.estado === "pendiente"
                          ? "text-yellow-600"
                          : r.estado === "retirado"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {r.estado}
                    </span>
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Fecha: {new Date(r.fecha).toLocaleString()}
                  </p>
                </div>

                {r.qr_code && (
                  <img
                    src={r.qr_code}
                    alt="QR"
                    className="w-24 h-24 object-contain"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
