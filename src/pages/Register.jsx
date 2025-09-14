import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import uboxLogo from '../assets/ubox_blanco.png';

export default function Register({ setUser }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [nombreFocused, setNombreFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError('');

    if (!nombre || !email || !password || !confirmPassword)
      return setError('Completa todos los campos');
    if (password !== confirmPassword)
      return setError('Las contraseñas no coinciden');
    if (!acceptedTerms)
      return setError('Debes aceptar los Términos y Condiciones');

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          email,
          contrasena: password,
          rol: 'user',
        }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || 'Error');
      localStorage.setItem('rb_token', data.token);
      localStorage.setItem('rb_user', JSON.stringify(data.user));
      setUser(data.user);
      navigate('/');
    } catch (e) {
      setError('Error conectando al servidor');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-cyan-100/30 to-blue-100/30 rounded-full blur-3xl transform -translate-x-32 translate-y-32"></div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center m-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25 mb-6">
            <img src={uboxLogo} alt="Ubox Logo" className="w-20 h-20" />
          </div>
          <h1 className="text-3xl font-light text-slate-800 mb-2">Crear cuenta</h1>
          <p className="text-slate-500 font-light">Únete para empezar</p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={submit}
          className="backdrop-blur-sm bg-white/70 border border-white/20 rounded-3xl p-8 shadow-xl shadow-slate-900/5 relative"
        >
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50/80 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          )}

          {/* Nombre */}
          <div className="mb-6 relative">
            <label
              className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                nombreFocused || nombre
                  ? 'top-2 text-xs text-blue-600 font-medium'
                  : 'top-1/2 -translate-y-1/2 text-slate-400'
              }`}
            >
              Nombre
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onFocus={() => setNombreFocused(true)}
              onBlur={() => setNombreFocused(false)}
              className={`w-full h-14 px-4 pt-6 pb-2 bg-white/50 border-2 rounded-2xl transition-all duration-300 outline-none ${
                nombreFocused ? 'border-blue-500 bg-white/80' : 'border-slate-200 hover:border-slate-300'
              }`}
            />
          </div>

          {/* Email */}
          <div className="mb-6 relative">
            <label
              className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                emailFocused || email
                  ? 'top-2 text-xs text-blue-600 font-medium'
                  : 'top-1/2 -translate-y-1/2 text-slate-400'
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
              className={`w-full h-14 px-4 pt-6 pb-2 bg-white/50 border-2 rounded-2xl transition-all duration-300 outline-none ${
                emailFocused ? 'border-blue-500 bg-white/80' : 'border-slate-200 hover:border-slate-300'
              }`}
            />
          </div>

          {/* Contraseña */}
          <div className="mb-6 relative">
            <label
              className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                passwordFocused || password
                  ? 'top-2 text-xs text-blue-600 font-medium'
                  : 'top-1/2 -translate-y-1/2 text-slate-400'
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
              className={`w-full h-14 px-4 pt-6 pb-2 bg-white/50 border-2 rounded-2xl transition-all duration-300 outline-none ${
                passwordFocused ? 'border-blue-500 bg-white/80' : 'border-slate-200 hover:border-slate-300'
              }`}
            />
          </div>

          {/* Confirmar Contraseña */}
          <div className="mb-6 relative">
            <label
              className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                confirmPasswordFocused || confirmPassword
                  ? 'top-2 text-xs text-blue-600 font-medium'
                  : 'top-1/2 -translate-y-1/2 text-slate-400'
              }`}
            >
              Confirmar contraseña
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setConfirmPasswordFocused(true)}
              onBlur={() => setConfirmPasswordFocused(false)}
              className={`w-full h-14 px-4 pt-6 pb-2 bg-white/50 border-2 rounded-2xl transition-all duration-300 outline-none ${
                confirmPasswordFocused ? 'border-blue-500 bg-white/80' : 'border-slate-200 hover:border-slate-300'
              }`}
            />
          </div>

          {/* Términos */}
          <div className="flex items-start gap-2 mb-8">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={() => setAcceptedTerms(!acceptedTerms)}
              className="mt-1 w-5 h-5 text-blue-600 border-2 border-slate-300 rounded-md focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="terms" className="text-sm text-slate-600 leading-relaxed cursor-pointer">
              Acepto los{' '}
              <span className="text-blue-600 hover:text-blue-700 transition-colors duration-200">
                Términos de servicio
              </span>{' '}
              y la{' '}
              <span className="text-blue-600 hover:text-blue-700 transition-colors duration-200">
                Política de privacidad
              </span>
            </label>
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
                Creando cuenta...
              </>
            ) : (
              <>
                Crear cuenta
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H7" />
                </svg>
              </>
            )}
          </button>

          {/* Link a login */}
          <div className="flex items-center justify-center mt-8 text-sm">
            <span className="text-slate-600">¿Ya tienes cuenta?</span>
            <Link
              to="/login"
              className="ml-2 text-blue-600 hover:text-blue-700 transition-colors duration-200 font-medium"
            >
              Inicia sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
