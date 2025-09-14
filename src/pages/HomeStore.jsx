import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Productos from "./Productos";
import CrearCaja from "./CrearCaja";
import RegistroVentas from "./RegistroVentas";
import PerfilStore from "./PerfilStore";
import DashboardStore from "./DashboardStore";

export default function HomeStore({ user, setUser }) {
  return (
    <div className="flex flex-col h-screen">
      <header className="p-2 border-b bg-white shadow">
        <h3 className="font-semibold text-lg">Panel de Tienda</h3>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-16">
        <Routes>
          {/* 👇 ahora la ruta raíz muestra publicaciones */}
          <Route path="/" element={<DashboardStore />} />
          <Route path="perfil" element={<PerfilStore user={user} setUser={setUser} />} />
          <Route path="productos" element={<Productos />} />
          <Route path="crear" element={<CrearCaja />} />
          <Route path="registro" element={<RegistroVentas />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}
