import React, { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import BoxesList from "../components/BoxesList"; // 🆕 Importa el nuevo componente

export default function HomeUser({ user, setUser }) {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [boxes, setBoxes] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    fetchBoxes();
  }, []);

  async function fetchBoxes() {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/boxes/public`);
      const data = await res.json();
      setBoxes(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error cargando cajas:", e);
      setBoxes([]);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("rb_token");
    localStorage.removeItem("rb_user");
    setUser(null);
  }

  function toggleFavorite(boxId) {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(boxId)) {
      newFavorites.delete(boxId);
    } else {
      newFavorites.add(boxId);
    }
    setFavorites(newFavorites);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 pb-12">
      {/* Decoraciones de fondo */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-full blur-3xl transform translate-x-48 -translate-y-48 pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-cyan-100/20 to-blue-100/20 rounded-full blur-3xl transform -translate-x-40 translate-y-40 pointer-events-none -z-10"></div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-800">Cajas Disponibles</h1>
              <p className="text-sm text-slate-500">Descubre productos increíbles</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2.5 rounded-2xl bg-white/60 hover:bg-white/80 border border-slate-200/50 transition-all duration-200 hover:shadow-md"
            >
              {showSearch ? (
                <XMarkIcon className="h-5 w-5 text-slate-600" />
              ) : (
                <MagnifyingGlassIcon className="h-5 w-5 text-slate-600" />
              )}
            </button>

            <button
              onClick={() => setShowProfile(!showProfile)}
              className="relative p-2.5 rounded-2xl bg-white/60 hover:bg-white/80 border border-slate-200/50 transition-all duration-200 hover:shadow-md"
            >
              <UserCircleIcon className="h-5 w-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showSearch ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-6 pb-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                placeholder="Buscar cajas..."
                className="w-full h-12 pl-12 pr-4 rounded-2xl border-2 border-slate-200 bg-white/70 backdrop-blur-sm outline-none transition-all duration-200 focus:border-blue-500 focus:bg-white/90 placeholder-slate-400"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Dropdown de perfil */}
        {showProfile && (
          <div className="absolute top-full right-6 mt-2 w-64 backdrop-blur-xl bg-white/90 border border-white/20 rounded-3xl shadow-xl shadow-slate-900/10 overflow-hidden z-50">
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 className="font-medium text-slate-800">{user?.name || 'Usuario'}</h3>
                  <p className="text-sm text-slate-500">{user?.email}</p>
                </div>
              </div>
            </div>
            <div className="p-2">
              <button
                onClick={logout}
                className="w-full p-3 rounded-2xl text-left hover:bg-red-50 transition-colors duration-200 flex items-center gap-3 text-red-600"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </header>

      {/* MAIN */}
      <main className="px-6 py-8">
        <BoxesList
          boxes={boxes}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          query={query}
          loading={loading}
        />
      </main>

      {/* Overlay para cerrar el dropdown */}
      {showProfile && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowProfile(false)}
        ></div>
      )}
    </div>
  );
}
