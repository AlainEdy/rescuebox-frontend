import { HeartIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import React from "react";

export default function BoxesList({ boxes, favorites, toggleFavorite, query, loading }) {
  const navigate = useNavigate();

  const filteredBoxes = boxes.filter(
    (b) => b.nombre && b.nombre.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Cargando cajas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredBoxes.map((box) => (
        <div
          key={`box-${box.id}`}
          className="group relative backdrop-blur-sm bg-white/70 border border-white/20 rounded-3xl shadow-lg shadow-slate-900/5 hover:shadow-xl hover:shadow-slate-900/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 pb-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-800 mb-2 line-clamp-1">
                  {box.nombre}
                </h3>
                <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                  {box.descripcion}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-blue-600">
                    S/ {box.precio_descuento}
                  </span>
                  {box.precio_normal && box.precio_normal > box.precio_descuento && (
                    <span className="text-sm text-slate-400 line-through">
                      S/ {box.precio_normal}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => toggleFavorite(box.id)}
                className="p-2 rounded-full hover:bg-white/80 transition-colors duration-200"
              >
                {favorites.has(box.id) ? (
                  <HeartSolidIcon className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartIcon className="h-6 w-6 text-slate-400 hover:text-red-500" />
                )}
              </button>
            </div>

            <div className="text-xs text-slate-500 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              {box.store_name}
            </div>
          </div>

          {/* Botón Ver detalle */}
          <div className="p-6 pt-0">
            <button
              onClick={() => navigate(`/boxes/${box.id}`)}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-2xl shadow-lg flex items-center justify-center gap-2"
            >
              <PlusCircleIcon className="h-5 w-5" />
              Ver detalle
            </button>
          </div>
        </div>
      ))}

      {filteredBoxes.length === 0 && !loading && (
        <div className="col-span-full text-center py-16">
          <h3 className="text-xl font-semibold text-slate-600 mb-2">No se encontraron cajas</h3>
          <p className="text-slate-500">
            {query ? "Intenta con otros términos de búsqueda" : "No hay cajas disponibles en este momento"}
          </p>
        </div>
      )}
    </div>
  );
}
