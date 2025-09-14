import React, { useState, useEffect } from "react";
import {
  CubeIcon,
  PlusCircleIcon,
  ArchiveBoxIcon,
  XMarkIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";

export default function CrearCaja() {
  const [boxes, setBoxes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [precioNormal, setPrecioNormal] = useState(0);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio_descuento: "",
    stock: 1,
    fecha_vencimiento: "",
    is_flash: false,
    productos: [],
  });

  useEffect(() => {
    fetchData();
    fetchProductos();
  }, []);

  useEffect(() => {
    calcularPrecioNormal();
  }, [form.productos]);

  async function fetchData() {
    const token = localStorage.getItem("rb_token");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/boxes`, {
        headers: { Authorization: "Bearer " + token },
      });
      setBoxes(await res.json());
    } catch (e) {
      console.error("Error cargando cajas:", e);
    }
  }

  async function fetchProductos() {
    const token = localStorage.getItem("rb_token");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/store/products`, {
        headers: { Authorization: "Bearer " + token },
      });
      setProductos(await res.json());
    } catch (e) {
      console.error("Error cargando productos:", e);
    }
  }

  function toggleProducto(prod) {
    const exists = form.productos.find((p) => p.product_id === prod.id);
    let nuevos;
    if (exists) {
      nuevos = form.productos.filter((p) => p.product_id !== prod.id);
    } else {
      nuevos = [
        ...form.productos,
        { product_id: prod.id, cantidad: 1, precio: prod.precio },
      ];
    }
    setForm({ ...form, productos: nuevos });
  }

  function cambiarCantidad(productId, cantidad) {
    const valor = parseInt(cantidad, 10);
    setForm({
      ...form,
      productos: form.productos.map((p) =>
        p.product_id === productId
          ? { ...p, cantidad: isNaN(valor) ? 1 : valor }
          : p
      ),
    });
  }

  function calcularPrecioNormal() {
    let total = 0;
    for (const prod of form.productos) {
      total += (prod.precio || 0) * (prod.cantidad || 1);
    }
    setPrecioNormal(total);
  }

  async function createBox(e) {
    e.preventDefault();
    const token = localStorage.getItem("rb_token");

    const payload = {
      ...form,
      fecha_vencimiento:
        form.fecha_vencimiento && form.fecha_vencimiento.trim() !== ""
          ? form.fecha_vencimiento
          : null,
    };

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/store/boxes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(payload),
      });
      setForm({
        nombre: "",
        descripcion: "",
        precio_descuento: "",
        stock: 1,
        fecha_vencimiento: "",
        is_flash: false,
        productos: [],
      });
      setPrecioNormal(0);
      setShowModal(false);
      fetchData();
    } catch (e) {
      console.error("Error creando caja:", e);
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-10">
      {/* BOTÓN para abrir el modal */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
      >
        <PlusCircleIcon className="w-5 h-5" />
        Crear nueva caja
      </button>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xl relative m-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cerrar botón */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
              onClick={() => setShowModal(false)}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CubeIcon className="w-5 h-5 text-orange-500" />
              Crear nueva caja
            </h2>

            <form onSubmit={createBox} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  placeholder="Nombre"
                  className="input"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                />
                <input
                  placeholder="Precio con descuento"
                  type="number"
                  className="input"
                  value={form.precio_descuento || ""}
                  onChange={(e) =>
                    setForm({ ...form, precio_descuento: e.target.value })
                  }
                />
                <input
                  placeholder="Stock"
                  type="number"
                  className="input"
                  value={form.stock ?? 1}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      stock: Number(e.target.value) || 1,
                    })
                  }
                />

                {!form.is_flash && (
                  <input
                    type="date"
                    className="input"
                    value={form.fecha_vencimiento || ""}
                    onChange={(e) =>
                      setForm({ ...form, fecha_vencimiento: e.target.value })
                    }
                  />
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="flash"
                  type="checkbox"
                  checked={form.is_flash}
                  onChange={(e) =>
                    setForm({ ...form, is_flash: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <label htmlFor="flash" className="text-sm text-gray-700">
                  Es una caja urgente (flash - dura solo unas horas)
                </label>
              </div>

              <textarea
                placeholder="Descripción de la caja"
                className="input min-h-[80px]"
                value={form.descripcion}
                onChange={(e) =>
                  setForm({ ...form, descripcion: e.target.value })
                }
              />

              {precioNormal > 0 && (
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Precio normal:</span>{" "}
                  S/ {precioNormal.toFixed(2)} <br />
                  <span className="text-pink-500 font-semibold">
                    Precio con descuento que defines: S/{" "}
                    {form.precio_descuento || "—"}
                  </span>
                </p>
              )}

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Seleccionar productos
                </h3>
                <div className="grid gap-3 max-h-60 overflow-y-auto pr-1">
                  {productos.map((prod) => {
                    const selected = form.productos.find(
                      (p) => p.product_id === prod.id
                    );
                    return (
                      <div
                        key={prod.id}
                        className="flex items-center justify-between gap-3 bg-gray-50 p-3 rounded-lg border hover:shadow"
                      >
                        <div className="flex items-center gap-3">
                          {prod.foto && (
                            <img
                              src={`${import.meta.env.VITE_API_URL}${prod.foto}`}
                              alt={prod.nombre}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div>
                            <h4 className="font-medium text-gray-800">
                              {prod.nombre}
                            </h4>
                            <p className="text-xs text-gray-500">
                              S/ {Number(prod.precio).toFixed(2)} • Stock:{" "}
                              {prod.stock}
                            </p>
                          </div>
                        </div>

                        {!selected ? (
                          <button
                            type="button"
                            onClick={() => toggleProducto(prod)}
                            className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full hover:bg-green-600"
                          >
                            <PlusIcon className="w-5 h-5" />
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              className="w-16 text-center border rounded p-1 text-sm"
                              min={1}
                              value={selected.cantidad ?? 1}
                              onChange={(e) =>
                                cambiarCantidad(prod.id, e.target.value)
                              }
                            />
                            <button
                              type="button"
                              onClick={() => toggleProducto(prod)}
                              className="px-2 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-semibold hover:scale-105 transition shadow"
              >
                Crear caja
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Lista de cajas */}
      <div className="mt-10">
        <div className="flex items-center gap-3 mb-4">
          <ArchiveBoxIcon className="w-6 h-6 text-pink-500" />
          <h2 className="text-xl font-semibold text-gray-800">Mis cajas</h2>
        </div>

        <div className="grid gap-4">
          {boxes.map((b) => (
            <div
              key={b.id}
              className="bg-white p-4 rounded-xl shadow border border-gray-100"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {b.nombre}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Normal: S/{b.precio_normal ?? 0} • Descuento: S/
                    {b.precio_descuento ?? 0}
                  </p>
                  <p className="text-sm text-gray-400">Stock: {b.stock}</p>
                  {b.is_flash ? (
                    <span className="text-xs text-red-500 font-semibold">
                      ⚡ Flash (expira en pocas horas)
                    </span>
                  ) : (
                    b.fecha_vencimiento && (
                      <span className="text-xs text-gray-500">
                        Vence:{" "}
                        {new Date(b.fecha_vencimiento).toLocaleDateString()}
                      </span>
                    )
                  )}
                </div>
                <CubeIcon className="w-6 h-6 text-gray-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
