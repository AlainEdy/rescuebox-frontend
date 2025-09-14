import React, { useState, useEffect } from "react";

export default function HomeAdmin() {
  // Formulario para registrar tienda
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    contrasena: "",
    direccion: "",
    telefono: "",
    descripcion: "",
    lat: "",
    lng: "",
    horario: "",
  });

  const [stores, setStores] = useState([]);
  const [stats, setStats] = useState({ users: 0 });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchStats();
    fetchStores();
  }, []);

  // Obtener estadísticas
  async function fetchStats() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("rb_token") },
      });
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.error("Error cargando estadísticas:", e);
    }
  }

  // Listar tiendas
  async function fetchStores() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stores`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("rb_token") },
      });
      const data = await res.json();
      setStores(data);
    } catch (e) {
      console.error("Error cargando tiendas:", e);
    }
  }

  // Crear tienda
  async function submit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stores`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("rb_token")
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Error creando tienda");
      setSuccess("Tienda creada correctamente");
      setForm({
        nombre: "",
        email: "",
        contrasena: "",
        direccion: "",
        telefono: "",
        descripcion: "",
        lat: "",
        lng: "",
        horario: "",
      });
      fetchStores();
    } catch (e) {
      setError("Error conectando al servidor");
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Dashboard Admin</h2>

      {/* Estadísticas */}
      <div className="mb-6 p-4 bg-white shadow rounded flex gap-4">
        <div>
          <h3 className="font-semibold">Usuarios</h3>
          <p className="text-xl">{stats.users}</p>
        </div>
        <div>
          <h3 className="font-semibold">Tiendas</h3>
          <p className="text-xl">{stores.length}</p>
        </div>
      </div>

      {/* Formulario creación de tienda */}
      <div className="mb-6 p-4 bg-white shadow rounded">
        <h3 className="font-semibold mb-2">Registrar Nueva Tienda</h3>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        {success && <p className="text-green-600 mb-2">{success}</p>}
        <form className="grid gap-2" onSubmit={submit}>
          <input
            placeholder="Nombre de la tienda"
            className="search-input"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
          <input
            placeholder="Email del dueño"
            className="search-input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            placeholder="Contraseña"
            type="password"
            className="search-input"
            value={form.contrasena}
            onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
          />
          <input
            placeholder="Dirección"
            className="search-input"
            value={form.direccion}
            onChange={(e) => setForm({ ...form, direccion: e.target.value })}
          />
          <input
            placeholder="Teléfono"
            className="search-input"
            value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          />
          <textarea
            placeholder="Descripción"
            className="search-input"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          />
          <input
            placeholder="Latitud"
            className="search-input"
            value={form.lat}
            onChange={(e) => setForm({ ...form, lat: e.target.value })}
          />
          <input
            placeholder="Longitud"
            className="search-input"
            value={form.lng}
            onChange={(e) => setForm({ ...form, lng: e.target.value })}
          />
          <input
            placeholder="Horario"
            className="search-input"
            value={form.horario}
            onChange={(e) => setForm({ ...form, horario: e.target.value })}
          />
          <button className="py-2 rounded bg-[var(--accent)] text-white">Registrar Tienda</button>
        </form>
      </div>

      {/* Lista de tiendas */}
      <div className="p-4 bg-white shadow rounded">
        <h3 className="font-semibold mb-2">Tiendas Registradas</h3>
        {stores.length === 0 ? (
          <p className="text-gray-500">No hay tiendas registradas.</p>
        ) : (
          <div className="grid gap-2">
            {stores.map((s) => (
              <div key={s.id} className="p-2 border rounded">
                <h4 className="font-semibold">{s.nombre}</h4>
                <p className="text-sm text-gray-600">{s.direccion}</p>
                <p className="text-sm text-gray-600">{s.telefono}</p>
                <p className="text-sm text-gray-600">{s.descripcion}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
