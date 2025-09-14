import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import uboxLogo from '../assets/ubox_blanco.png';

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!email || !password) return setError('Completa los campos');
    if (!/\S+@\S+\.\S+/.test(email)) return setError('Por favor ingresa un email válido');
    
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, contrasena: password })
      });

      const data = await res.json();
      if (!res.ok) return setError(data.error || 'Error');

      // ✅ Guardar solo token y user en localStorage
      localStorage.setItem('rb_token', data.token);
      localStorage.setItem('rb_user', JSON.stringify(data.user));

      setUser(data.user);

      // ✅ Redirigir según rol
      if (data.user.role === 'store') {
        navigate('/store');
      } else if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user'); // rol 'user' → clientes
      }
    } catch (e) {
      setError('Error conectando al servidor');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-cyan-100/30 to-blue-100/30 rounded-full blur-3xl transform -translate-x-32 translate-y-32"></div>
      
      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25 mb-6">
            <img src={uboxLogo} alt="Ubox Logo" className="w-20 h-20" />
          </div>
          <h1 className="text-3xl font-light text-slate-800 mb-2">Bienvenido</h1>
          <p className="text-slate-500 font-light">Inicia sesión para continuar</p>
        </div>

        {/* Formulario */}
        <form onSubmit={submit} className="backdrop-blur-sm bg-white/70 border border-white/20 rounded-3xl p-8 shadow-xl shadow-slate-900/5 relative">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50/80 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Campo Email */}
          <div className="mb-6 relative">
            <label
              className={`absolute left-12 transition-all duration-300 pointer-events-none ${
                emailFocused || email
                  ? "top-2 text-xs text-blue-600 font-medium"
                  : "top-1/2 -translate-y-1/2 text-slate-400"
              }`}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              className={`w-full h-14 pl-12 pr-4 pt-6 pb-2 bg-white/50 border-2 rounded-2xl transition-all duration-300 outline-none ${
                emailFocused
                  ? "border-blue-500 bg-white/80"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <svg className={`w-5 h-5 transition-colors duration-300 ${emailFocused ? "text-blue-500" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
          </div>

          {/* Campo Contraseña */}
          <div className="mb-8 relative">
            <label
              className={`absolute left-12 transition-all duration-300 pointer-events-none ${
                passwordFocused || password
                  ? "top-2 text-xs text-blue-600 font-medium"
                  : "top-1/2 -translate-y-1/2 text-slate-400"
              }`}
            >
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              className={`w-full h-14 pl-12 pr-4 pt-6 pb-2 bg-white/50 border-2 rounded-2xl transition-all duration-300 outline-none ${
                passwordFocused
                  ? "border-blue-500 bg-white/80"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <svg className={`w-5 h-5 transition-colors duration-300 ${passwordFocused ? "text-blue-500" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/25 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Iniciando sesión...
              </>
            ) : (
              <>
                Iniciar sesión
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>

          {/* Enlaces */}
          <div className="flex items-center justify-between mt-8 text-sm">
            <Link to="/forgot-password" className="text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium">
              ¿Olvidaste tu contraseña?
            </Link>
            <Link to="/register" className="text-blue-600 hover:text-blue-700 transition-colors duration-200 font-medium">
              Crear cuenta
            </Link>
          </div>
        </form>

        {/* Términos */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400 leading-relaxed">
            Al continuar, aceptas nuestros{' '}
            <span className="text-blue-600 hover:text-blue-700 cursor-pointer transition-colors duration-200">
              Términos de servicio
            </span>{' '}
            y{' '}
            <span className="text-blue-600 hover:text-blue-700 cursor-pointer transition-colors duration-200">
              Política de privacidad
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
