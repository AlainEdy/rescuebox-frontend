import React from "react";
import { useNavigate } from "react-router-dom";
import {
  UserCircleIcon,
  EnvelopeIcon,
  UserGroupIcon,
  ArrowLeftOnRectangleIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/solid";

export default function PerfilUser({ user, setUser }) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("rb_token");
    localStorage.removeItem("rb_user");
    setUser(null);
    navigate("/login");
  }

  return (
    <div className="max-w-md mx-auto mt-10 px-4 py-6 sm:py-8 space-y-6">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-6 shadow-lg border border-gray-100 animate-slide-up">
        <div className="flex flex-col items-center text-center space-y-4">
          <UserCircleIcon className="w-24 h-24 text-orange-500" />
          <h2 className="text-2xl font-bold text-gray-900">Hola, {user?.nombre}</h2>
          <p className="text-gray-600 text-sm">¡Bienvenido/a de nuevo!</p>
        </div>

        <div className="mt-6 space-y-4 text-sm text-gray-700">
          <div className="flex items-center space-x-3">
            <EnvelopeIcon className="w-5 h-5 text-gray-400" />
            <span><strong>Email:</strong> {user?.email}</span>
          </div>
          <div className="flex items-center space-x-3">
            <UserGroupIcon className="w-5 h-5 text-gray-400" />
            <span><strong>Rol:</strong> {user?.rol}</span>
          </div>
          <div className="flex items-center space-x-3">
            <CalendarDaysIcon className="w-5 h-5 text-gray-400" />
            <span>
              <strong>Registrado:</strong>{" "}
              {new Date(user?.fecha_registro).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2.5 px-4 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400">UBOX v1.0</p>
    </div>
  );
}
