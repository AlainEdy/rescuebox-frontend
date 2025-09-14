import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  FolderIcon,
  ShoppingCartIcon,
  UserIcon,
  CubeIcon,
  PlusCircleIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';

export default function BottomNav({ role }) {
  const navigate = useNavigate();

  const itemsUser = [
    { label: 'Inicio', icon: HomeIcon, path: '/' },
    { label: 'Categorias', icon: FolderIcon, path: '/categorias' },
    { label: 'Carrito', icon: ShoppingCartIcon, path: '/carrito' },
    { label: 'Perfil', icon: UserIcon, path: '/perfil' },
  ];

  const itemsStore = [
    { label: 'Home', icon: HomeIcon, path: '/store' },
    { label: 'Productos', icon: CubeIcon, path: '/store/productos' },
    { label: 'Crear', icon: PlusCircleIcon, path: '/store/crear' },
    { label: 'Registro', icon: ClipboardDocumentListIcon, path: '/store/registro' },
    { label: 'Perfil', icon: UserIcon, path: '/store/perfil' },
  ];

  const items = role === 'store' ? itemsStore : itemsUser;

  return (
    <nav className="bottom-nav fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-around py-2">
      {items.map((it) => (
        <button
          key={it.path}
          onClick={() => navigate(it.path)}
          className="icon-btn flex flex-col items-center text-xs text-gray-600 hover:text-[var(--accent)]"
        >
          <it.icon className="h-6 w-6 mb-1" />
          <span>{it.label}</span>
        </button>
      ))}
    </nav>
  );
}
