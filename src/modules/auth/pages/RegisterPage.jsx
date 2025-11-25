import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, Phone } from 'lucide-react';
import { useAuth } from '../../../context/auth-context.js';

export default function RegisterPage({ onRegister }) {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  // estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // control de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // envío
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    // validación simple de contraseñas
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setSubmitting(false);
      return;
    }

    try {
      if (typeof onRegister === 'function') {
        // callback externo para. tests, mocks
        await onRegister(formData);
      } else if (registerUser) {
        // usar register del AuthContext
        await registerUser({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        });
      }
      // redirigir al login al terminar
      navigate('/login');
    } catch (err) {
      setError(err?.message || 'No se pudo crear la cuenta');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <div className="min-h-[calc(100vh-100px)] grid place-items-center px-6 py-12  animate-[fade-in_var(--transition-base,300ms)_both]">
        <div className="w-full max-w-md">
          <div className="bg-white/75 rounded-xl shadow-sm p-8 animate-[slide-up_var(--transition-slow,500ms)_both]">
            <h1 className="text-center text-3xl font-semibold text-(--color-primary1) font-[var(--font-display,inherit)]">
              Crear Cuenta
            </h1>
            <p className="mt-1 text-center text-sm text-muted font-[var(--font-secondary,inherit)]">
               
            </p>

            {/* Error simple */}
            {error && (
              <div className="mt-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
              {/* Nombre */}
              <div className="grid gap-2">
                <label htmlFor="name" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-primary,#1f1f1f)]">
                  <UserIcon size={18} />
                  Nombre Completo
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Juan Pérez"
                  required
                  autoComplete="name" // sugerencia del navegador
            className="w-full rounded-md border border-[var(--color-border,#e5e7eb)] px-3 py-2 text-[var(--color-text-primary,#1f1f1f)] outline-none transition focus:border-[var(--color-primary1,#6B5444)] focus:ring-2 focus:ring-[rgba(68,49,20,0.15)]"
                />
              </div>

              {/* Email */}
              <div className="grid gap-2">
                <label htmlFor="email" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-primary,#1f1f1f)]">
                  <Mail size={18} />
                  Correo Electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  required
                  autoComplete="email"
            className="w-full rounded-md border border-[var(--color-border,#e5e7eb)] px-3 py-2 text-[var(--color-text-primary,#1f1f1f)] outline-none transition focus:border-[var(--color-primary1,#6B5444)] focus:ring-2 focus:ring-[rgba(68,49,20,0.15)]"
                />
              </div>

              {/* Teléfono */}
              <div className="grid gap-2">
                <label htmlFor="phone" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-primary,#1f1f1f)]">
                  <Phone size={18} />
                  Teléfono
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+56 9 1234 5678"
                  required
                  autoComplete="tel"
                  inputMode="tel"
                  pattern="^\+?\d[\d\s\-]{7,}$" // formato flexible: +56 9 1234 5678
            className="w-full rounded-md border border-[var(--color-border,#e5e7eb)] px-3 py-2 text-[var(--color-text-primary,#1f1f1f)] outline-none transition focus:border-[var(--color-primary1,#6B5444)] focus:ring-2 focus:ring-[rgba(68,49,20,0.15)]"
                />
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <label htmlFor="password" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-primary,#1f1f1f)]">
                  <Lock size={18} />
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  minLength={6} // ajusta a tu política
            className="w-full rounded-md border border-[var(--color-border,#e5e7eb)] px-3 py-2 text-[var(--color-text-primary,#1f1f1f)] outline-none transition focus:border-[var(--color-primary1,#6B5444)] focus:ring-2 focus:ring-[rgba(68,49,20,0.15)]"
                />
              </div>

              {/* Confirm Password */}
              <div className="grid gap-2">
                <label htmlFor="confirmPassword" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-primary,#1f1f1f)]">
                  <Lock size={18} />
                  Confirmar Contraseña
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  minLength={6}
            className="w-full rounded-md border border-[var(--color-border,#e5e7eb)] px-3 py-2 text-[var(--color-text-primary,#1f1f1f)] outline-none transition focus:border-[var(--color-primary1,#6B5444)] focus:ring-2 focus:ring-[rgba(68,49,20,0.15)]"
                />
              </div>

              {/* Botón */}
              <button
                type="submit"
                disabled={submitting}
                aria-busy={submitting}
          className="mt-2 inline-flex items-center justify-center rounded-md bg-[var(--color-primary1,#6B5444)] px-4 py-2 font-semibold text-white shadow-sm transition hover:brightness-105 hover:-translate-y-0.5 active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Creando cuenta…' : 'Registrarse'}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 border-t border-[var(--color-border-light,#f0f2f5)] pt-6 text-center">
              <p className="text-sm text-[var(--color-text-secondary,#4b5563)]">
                ¿Ya tienes una cuenta?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
          className="font-semibold underline text-[var(--color-primary1,#6B5444)] hover:opacity-90"
                >
                  Inicia sesión aquí
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
