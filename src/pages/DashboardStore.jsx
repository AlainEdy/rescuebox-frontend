import React, { useEffect, useState } from "react";

export default function DashboardStore() {
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBoxes();
  }, []);

  async function fetchBoxes() {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("rb_token");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/store/boxes`, {
        headers: { Authorization: "Bearer " + token },
      });
      if (!res.ok) throw new Error("No se pudieron cargar las cajas");
      const data = await res.json();
      setBoxes(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError("No se pudieron cargar las cajas.");
      setBoxes([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4">
      <h3 className="text-xl font-bold mb-4">Cajas de mi Tienda</h3>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      {loading ? (
        <p className="text-gray-500">Cargando cajas...</p>
      ) : (
        <div className="grid gap-3">
          {boxes.length === 0 && (
            <p className="text-gray-500">No hay cajas disponibles.</p>
          )}
          {boxes.map((box) => (
            <div
              key={box.id}
              className="p-4 border rounded bg-white shadow hover:shadow-md transition"
            >
              <h5 className="font-semibold">{box.nombre}</h5>
              <p className="text-sm text-gray-500">{box.descripcion}</p>
              <div className="flex justify-between mt-1">
                <span className="text-[var(--accent)] font-bold">
                  S/ {Number(box.precio_descuento).toFixed(2)}
                </span>
                <span className="text-gray-600">Stock: {box.stock}</span>
              </div>
              {box.productos && box.productos.length > 0 && (
                <div className="mt-2">
                  <h6 className="font-semibold text-sm">Productos:</h6>
                  <ul className="list-disc list-inside text-sm">
                    {box.productos.map((p) => (
                      <li key={p.product_id}>
                        {p.nombre} x{p.cantidad} - S/ {Number(p.precio).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
