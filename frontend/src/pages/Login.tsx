import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import type { CaptchaResponse } from '../types';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaData, setCaptchaData] = useState<CaptchaResponse | null>(null);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [loadingCaptcha, setLoadingCaptcha] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const fetchCaptcha = async () => {
    try {
      setLoadingCaptcha(true);
      const data = await authService.getCaptcha();
      setCaptchaData(data);
      setCaptchaAnswer('');
    } catch (err: unknown) {
      console.error('Error fetching captcha:', err);
    } finally {
      setLoadingCaptcha(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    } else {
      fetchCaptcha();
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!captchaData) {
      setError('Por favor espere a que se genere el código de seguridad.');
      return;
    }

    if (!captchaAnswer.trim()) {
      setError('Ingrese el código de verificación de seguridad.');
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await authService.login(
        username.trim(),
        password,
        captchaData.captchaId,
        captchaAnswer.trim()
      );
      login(loggedUser);
      navigate('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(message);
      // Siempre recargar el captcha luego de un intento fallido para prevenir ataques por fuerza bruta
      fetchCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-350 premium-gradient-bg">
      {/* Visual background blur blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md p-8 md:p-10 mx-4 glass-panel premium-glow-teal relative z-10 shadow-2xl rounded-3xl border border-white/20 dark:border-slate-800/80">
        <div className="text-center mb-7">
          <div className="w-16 h-16 bg-gradient-to-tr from-teal-500 to-emerald-400 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/20 transition-transform duration-300 hover:scale-105">
            <span className="text-3xl select-none">🐾</span>
          </div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent tracking-tight">S.I.G.A. UNLaR</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mt-2">
            Hospital Veterinario Universitario — Sede Chamical
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-3 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 rounded-full text-[11px] font-bold border border-teal-200/60 dark:border-teal-800/50">
            <span>🔒</span> Acceso Protegido y Encriptado
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-semibold border border-rose-200 dark:border-rose-900/50 flex items-start gap-2 shadow-sm">
              <span className="text-sm">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 dark:focus:border-teal-400 focus:bg-white dark:focus:bg-slate-900 transition-all duration-200"
              placeholder="Ingrese su usuario"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 dark:focus:border-teal-400 focus:bg-white dark:focus:bg-slate-900 transition-all duration-200"
              placeholder="••••••••••••"
              required
            />
          </div>

          {/* CAPTCHA Anti-Bot Section */}
          <div className="pt-1.5">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">
                Verificación Anti-Bot 🛡️
              </label>
              <button
                type="button"
                onClick={fetchCaptcha}
                disabled={loadingCaptcha}
                className="text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-bold flex items-center gap-1 transition-colors disabled:opacity-50"
                title="Generar otro código"
              >
                <svg className={`w-3.5 h-3.5 ${loadingCaptcha ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {loadingCaptcha ? 'Cargando...' : 'Nuevo código'}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 bg-slate-100/80 dark:bg-slate-900/80 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex-shrink-0 flex items-center justify-center bg-slate-950 rounded-xl overflow-hidden shadow-inner border border-slate-800/80 h-[52px] min-w-[170px]">
                {loadingCaptcha ? (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="w-3.5 h-3.5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></span>
                    <span>Generando...</span>
                  </div>
                ) : captchaData?.captchaImage ? (
                  <img
                    src={captchaData.captchaImage}
                    alt="Código anti-bot"
                    className="h-full w-auto select-none pointer-events-none"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={fetchCaptcha}
                    className="text-xs text-rose-400 hover:underline"
                  >
                    Reintentar cargar
                  </button>
                )}
              </div>

              <input
                type="text"
                value={captchaAnswer}
                onChange={(e) => setCaptchaAnswer(e.target.value.toUpperCase())}
                maxLength={6}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 dark:focus:border-teal-400 font-mono tracking-widest text-center uppercase text-base font-extrabold transition-all duration-200"
                placeholder="CÓDIGO"
                required
                autoComplete="off"
              />
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 pl-1">
              Ingrese las 5 letras o números de la imagen para validar que no es un robot.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || loadingCaptcha}
            className="w-full mt-2 bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white font-bold py-3 rounded-xl shadow-lg shadow-teal-600/10 hover:shadow-teal-600/20 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 select-none text-sm uppercase tracking-wider flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Verificando...</span>
              </>
            ) : (
              'Ingresar al Sistema'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
