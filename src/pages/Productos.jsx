import React, { useEffect, useState, useEffect as useReactEffect } from "react";
import {
  TagIcon,
  CurrencyDollarIcon,
  CubeIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

function InputWithIcon({ icon: Icon, className = "", ...props }) {
  return (
    <div className="relative mb-4">
      <Icon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        {...props}
        className={`pl-10 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${className}`}
      />
    </div>
  );
}

export default function Productos() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    stock: 1,
    foto: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  // limpiar memoria de previews
  useReactEffect(() => {
    if (!form.foto) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(form.foto);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [form.foto]);

  async function fetchProducts() {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("rb_token");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/store/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al cargar productos");
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Respuesta inválida");
      setProducts(data);
    } catch (e) {
      console.error(e);
      setError("No se pudieron cargar los productos.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  async function createProduct(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.nombre || !form.precio) {
      setError("Por favor completa todos los campos obligatorios.");
      return;
    }

    const precioNum = parseFloat(form.precio);
    const stockNum = parseInt(form.stock);
    if (isNaN(precioNum) || precioNum <= 0) {
      setError("Precio inválido.");
      return;
    }
    if (isNaN(stockNum) || stockNum <= 0) {
      setError("Stock inválido.");
      return;
    }

    const token = localStorage.getItem("rb_token");

    try {
      const formData = new FormData();
      formData.append("nombre", form.nombre);
      formData.append("precio", precioNum);
      formData.append("stock", stockNum);
      if (form.foto) formData.append("foto", form.foto);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/store/products`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Error backend:", data);
        throw new Error(data.error || "Error al crear producto");
      }

      setForm({
        nombre: "",
        precio: "",
        stock: 1,
        foto: null,
      });
      setPreview(null);
      setSuccess("Producto agregado correctamente ✅");
      setModalOpen(false);
      fetchProducts();
    } catch (e) {
      console.error(e);
      setError("No se pudo crear el producto. Verifica los datos.");
    }
  }

  return (
    <div className="pb-16 relative">
      <h3 className="text-xl font-bold mb-4">Productos de mi Tienda</h3>

      <button
        onClick={() => {
          setForm({
            nombre: "",
            precio: "",
            stock: 1,
            foto: null,
          });
          setPreview(null);
          setError("");
          setSuccess("");
          setModalOpen(true);
        }}
        className="rounded-xl mb-6 py-2 px-4 bg-[var(--accent)] text-white hover:opacity-90 transition"
      >
        + Agregar Producto
      </button>

      {/* Lista de productos */}
      {loading ? (
        <p className="text-gray-500">Cargando productos...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No hay productos todavía.</p>
      ) : (
        <div className="grid gap-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-xl bg-white shadow-lg border flex gap-4 hover:shadow-md transition"
            >
              {p.foto && (
                <img
                  src={
                    p.foto.startsWith("http")
                      ? p.foto
                      : `${import.meta.env.VITE_API_URL}${p.foto}`
                  }
                  alt={p.nombre}
                  className="w-16 h-16 object-cover rounded"
                />

              )}
              <div className="flex-1">
                <h5 className="font-semibold">{p.nombre}</h5>
                <div className="flex justify-between mt-1">
                  <span className="text-[var(--accent)] font-bold">
                    S/ {Number(p.precio).toFixed(2)}
                  </span>
                  <span className="text-gray-600">Stock: {p.stock}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <>
          <div
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <form
              onSubmit={createProduct}
              className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
              <h4 className="text-xl font-semibold mb-6">Nuevo Producto</h4>

              {error && <p className="text-red-600 mb-4">{error}</p>}
              {success && <p className="text-green-600 mb-4">{success}</p>}

              <InputWithIcon
                icon={TagIcon}
                placeholder="Nombre"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
              />
              <InputWithIcon
                icon={CurrencyDollarIcon}
                type="number"
                step="0.01"
                placeholder="Precio"
                value={form.precio}
                onChange={(e) => setForm({ ...form, precio: e.target.value })}
                required
              />
              <InputWithIcon
                icon={CubeIcon}
                type="number"
                min="1"
                placeholder="Stock"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                required
              />

              {/* Input file */}
              <div className="relative mb-4">
                <PhotoIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="file"
                  accept="image/*"
                  className="pl-10 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  onChange={(e) =>
                    setForm({ ...form, foto: e.target.files[0] })
                  }
                />
              </div>

              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded mb-4 border"
                />
              )}

              <button
                type="submit"
                className="mt-4 py-2 rounded-xl bg-[var(--accent)] text-white w-full hover:opacity-90 transition"
              >
                Guardar Producto
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
