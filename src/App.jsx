import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Loading from './pages/Loading';
import Login from './pages/Login';
import Register from './pages/Register';
import HomeUser from './pages/HomeUser';
import HomeStore from './pages/HomeStore';
import HomeAdmin from './pages/HomeAdmin';
import BottomNav from './components/BottomNav';

// pantallas usuario
import Categorias from './pages/Categorias';
import Carrito from './pages/Carrito';
import PerfilUser from './pages/PerfilUser';
import BoxDetail from './pages/BoxDetail'; // 👈 NUEVO

// pantallas tienda
import Productos from './pages/Productos';
import CrearCaja from './pages/CrearCaja';
import RegistroVentas from './pages/RegistroVentas';
import PerfilStore from './pages/PerfilStore';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setTimeout(() => setLoading(false), 3000);
    const token = localStorage.getItem('rb_token');
    if (token) {
      try {
        const userJson = JSON.parse(localStorage.getItem('rb_user') || 'null');
        setUser(userJson);
      } catch (e) {}
    }
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="pb-0">
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />

        {/* Rutas protegidas */}
        <Route
          path="/*"
          element={user ? <ProtectedRoutes user={user} setUser={setUser} /> : <Navigate to="/login" />}
        />
      </Routes>

      {user && <BottomNav role={user.role} />}
    </div>
  );
}

// Componente que maneja rutas internas según rol
function ProtectedRoutes({ user, setUser }) {
  return (
    <Routes>
      {/* Home según rol */}
      <Route
        index
        element={
          user.role === 'store' ? (
            <HomeStore user={user} setUser={setUser} />
          ) : user.role === 'admin' ? (
            <HomeAdmin user={user} setUser={setUser} />
          ) : (
            <HomeUser user={user} setUser={setUser} />
          )
        }
      />

      {/* Usuario */}
      <Route path="categorias" element={<Categorias />} />
      <Route path="carrito" element={<Carrito />} />
      <Route path="perfil" element={<PerfilUser user={user} setUser={setUser} />} />
      <Route path="boxes/:id" element={<BoxDetail />} /> {/* 👈 NUEVO */}

      {/* Tienda */}
      <Route path="store/*" element={<HomeStore user={user} setUser={setUser} />} />

      {/* Admin */}
      <Route path="admin/*" element={<HomeAdmin user={user} setUser={setUser} />} />

      {/* Rutas no encontradas */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
