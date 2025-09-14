import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function BoxDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [box, setBox] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [franja, setFranja] = useState("");
  const [franjasDisponibles, setFranjasDisponibles] = useState([]);

  useEffect(() => {
    fetchBox();
  }, [id]);

  useEffect(() => {
    if (box && box.is_flash) {
      generarFranjas();
    }
  }, [box]);

  async function fetchBox() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/boxes/${id}`);
      if (!res.ok) throw new Error("No se pudo obtener la caja");
      const data = await res.json();
      setBox(data);
    } catch (err) {
      setError("Error cargando la caja.");
    } finally {
      setLoading(false);
    }
  }

  function generarFranjas() {
    const apertura = box?.horario_apertura || "08:00";
    const cierre = box?.horario_cierre || "18:00";
    const [ah, am] = apertura.split(":").map(Number);
    const [ch, cm] = cierre.split(":").map(Number);

    const start = ah * 60 + am;
    const end = ch * 60 + cm;

    const opciones = [];
    for (let t = start; t < end; t += 30) {
      const h = String(Math.floor(t / 60)).padStart(2, "0");
      const m = String(t % 60).padStart(2, "0");
      const next = t + 30;
      const nh = String(Math.floor(next / 60)).padStart(2, "0");
      const nm = String(next % 60).padStart(2, "0");
      opciones.push(`${h}:${m}-${nh}:${nm}`);
    }

    setFranjasDisponibles(opciones);
  }

  async function reservarCaja() {
    setError("");
    try {
      if (box.is_flash && !franja) {
        setError("Selecciona una franja horaria");
        return;
      }

      const token = localStorage.getItem("rb_token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reservas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          box_id: id,
          franja_horaria: franja || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al reservar");

      navigate("/reserva-confirmada", {
        state: { qr: data.qr_code, box, franja },
      });
    } catch (err) {
      setError("No se pudo reservar la caja.");
    }
  }

  if (loading) return <p className="p-6 text-center">Cargando...</p>;
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      {box && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800">{box.nombre}</h2>
          <p className="text-gray-600 mt-2">{box.descripcion}</p>
          <p className="mt-3 text-lg text-blue-600 font-semibold">
            S/ {box.precio_descuento}{" "}
            <span className="text-sm text-gray-400 line-through ml-2">
              {box.precio_normal}
            </span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {box.is_flash
              ? "Caja flash (elige horario)"
              : `Disponible hasta: ${new Date(
                  box.fecha_vencimiento
                ).toLocaleDateString()}`}
          </p>
          <p className="text-sm text-gray-500">Stock: {box.stock}</p>
          <p className="text-sm text-gray-500">
            Tienda: {box.store_name} — {box.direccion}
          </p>

          {/* Productos */}
          <div className="mt-4">
            <h3 className="font-medium text-gray-700 mb-2">
              Productos incluidos:
            </h3>
            <ul className="space-y-2">
              {box.productos?.length > 0 ? (
                box.productos.map((p, idx) => (
                  <li
                    key={`${p.product_id}-${idx}`}
                    className="flex items-center gap-3"
                  >
                    {p.foto && (
                      <img
                        src={`${import.meta.env.VITE_API_URL}${p.foto}`}
                        alt={p.nombre}
                        className="w-12 h-12 object-cover rounded-lg border"
                      />
                    )}
                    <span>
                      {p.nombre} (x{p.cantidad}) - S/ {p.precio}
                    </span>
                  </li>
                ))
              ) : (
                <li className="italic text-gray-400">Sin productos</li>
              )}
            </ul>
          </div>

          {/* Selección de franja solo si es flash */}
          {box.is_flash && (
            <div className="mt-6">
              <select
                className="border p-2 rounded w-full mb-3"
                value={franja}
                onChange={(e) => setFranja(e.target.value)}
              >
                <option value="">Selecciona franja horaria</option>
                {franjasDisponibles.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
              {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
            </div>
          )}

          <button
            onClick={reservarCaja}
            className="w-full mt-3 py-3 rounded-xl bg-green-600 text-white text-lg font-semibold hover:bg-green-700 transition"
          >
            Reservar ahora
          </button>
        </div>
      )}
    </div>
  );
}
