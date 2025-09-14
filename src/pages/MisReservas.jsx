import React, { useEffect, useState } from "react";
import React, { useState } from 'react';

export default function MisReservas() {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("rb_token");
    fetch(`${import.meta.env.VITE_API_URL}/api/reservas/mis`, {
      headers: { Authorization: "Bearer " + token }
    })
      .then(res => res.json())
      .then(setReservas)
      .catch(() => setReservas([]));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Mis reservas</h2>
      {reservas.length === 0 ? (
        <p>No tienes reservas aún</p>
      ) : (
        <div className="space-y-4">
          {reservas.map(r => (
            <div key={r.id} className="p-4 border rounded">
              <p className="font-semibold">{r.box_nombre}</p>
              <p className="text-sm text-gray-500">Tienda: {r.store_name}</p>
              <p className="text-sm text-gray-500">Estado: {r.estado}</p>
              <p className="text-sm text-gray-500">Franja: {r.franja_horaria}</p>
              <img src={r.qr_code} alt="QR" className="w-32 h-32 mt-2" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
