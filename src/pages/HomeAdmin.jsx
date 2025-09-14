import React, { useEffect, useState } from "react";

export default function HomeAdmin() {
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [stats, setStats] = useState({});
  const [form, setForm] = useState({
    nombre_user: "",
    email: "",
    contrasena: "",
    nombre_store: "",
    direccion: "",
    telefono: "",
    descripcion: "",
    lat: "",
    lng: "",
    hora_inicio: "",
    hora_fin: "",
  });
  const [error, setError] = useState("");
  const token = localStorage.getItem("rb_token");

  // Generar lista de horas en intervalos de 30 min
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const h = String(Math.floor(i / 2)).padStart(2, "0");
    const m = i % 2 === 0 ? "00" : "30";
    return `${h}:${m}`;
  });

  useEffect(() => {
    fetchUsers();
    fetchStoresWithBoxes();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
        headers: { Authorization: "Bearer " + token },
      });
      const data = await res.json();
      setUsers(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchStoresWithBoxes = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stores-with-boxes`, {
        headers: { Authorization: "Bearer " + token },
      });
      const data = await res.json();
      setStores(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats`, {
        headers: { Authorization: "Bearer " + token },
      });
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.error(e);
    }
  };

  const createStore = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || "Error creando tienda");
        return;
      }
      setForm({
        nombre_user: "",
        email: "",
        contrasena: "",
        nombre_store: "",
        direccion: "",
        telefono: "",
        descripcion: "",
        lat: "",
        lng: "",
        hora_inicio: "",
        hora_fin: "",
      });
      fetchStoresWithBoxes();
    } catch (e) {
      setError("Error conectando al servidor");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Dashboard Admin</h2>

      {/* Estadísticas */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Estadísticas</h3>
        <div className="flex gap-4">
          <div className="p-4 bg-white rounded shadow">
            <span className="font-bold">{stats.users || 0}</span> Usuarios
          </div>
          <div className="p-4 bg-white rounded shadow">
            <span className="font-bold">{stores.length}</span> Tiendas
          </div>
        </div>
      </div>

      {/* Formulario crear tienda */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Registrar nueva tienda</h3>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <form className="grid gap-2" onSubmit={createStore}>
          <input placeholder="Nombre usuario" className="search-input" value={form.nombre_user} onChange={e => setForm({...form, nombre_user: e.target.value})} />
          <input placeholder="Email" className="search-input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <input type="password" placeholder="Contraseña" className="search-input" value={form.contrasena} onChange={e => setForm({...form, contrasena: e.target.value})} />
          <input placeholder="Nombre tienda" className="search-input" value={form.nombre_store} onChange={e => setForm({...form, nombre_store: e.target.value})} />
          <input placeholder="Dirección" className="search-input" value={form.direccion} onChange={e => setForm({...form, direccion: e.target.value})} />
          <input placeholder="Teléfono" className="search-input" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} />
          <input placeholder="Latitud" className="search-input" value={form.lat} onChange={e => setForm({...form, lat: e.target.value})} />
          <input placeholder="Longitud" className="search-input" value={form.lng} onChange={e => setForm({...form, lng: e.target.value})} />
          
          {/* Nuevo selector de horario */}
          <label className="text-sm font-medium mt-2">Horario de atención</label>
          <div className="flex gap-2">
            <select className="search-input" value={form.hora_inicio} onChange={e => setForm({...form, hora_inicio: e.target.value})}>
              <option value="">Desde</option>
              {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select className="search-input" value={form.hora_fin} onChange={e => setForm({...form, hora_fin: e.target.value})}>
              <option value="">Hasta</option>
              {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <textarea placeholder="Descripción" className="search-input" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} />
          <button className="py-2 rounded bg-[var(--accent)] text-white">Crear tienda</button>
        </form>
      </div>

      {/* Listado tiendas */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Tiendas registradas</h3>
        {stores.length === 0 ? (
          <p>No hay tiendas registradas.</p>
        ) : (
          <div className="grid gap-2">
            {stores.map(s => (
              <div key={s.store_id} className="p-3 bg-white rounded shadow flex justify-between items-center">
                <div>
                  <p className="font-semibold">{s.store_nombre}</p>
                  <p className="text-sm text-gray-500">{s.direccion}</p>
                  <p className="text-sm text-gray-500">{s.email}</p>
                  <p className="text-sm text-gray-500">Publicaciones: {s.publicaciones}</p>
                  <p className="text-sm text-gray-500">Horario: {s.hora_inicio} - {s.hora_fin}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Listado usuarios */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Usuarios registrados</h3>
        {users.length === 0 ? (
          <p>No hay usuarios registrados.</p>
        ) : (
          <div className="grid gap-2">
            {users.map(u => (
              <div key={u.id} className="p-3 bg-white rounded shadow">
                <p className="font-semibold">{u.nombre}</p>
                <p className="text-sm text-gray-500">{u.email}</p>
                <p className="text-sm text-gray-500">Rol: {u.rol}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
