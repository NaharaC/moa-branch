import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth, isAdminRole } from '../../../context/auth-context.js';
import { useRedirectAfterAuth } from '../../auth/hooks/useRedirectAuth.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { API_PATHS } from '../../../config/api-paths.js';


export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate(); 
  const redirect = useRedirectAfterAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

/* // Validaciones básicas
    const ve = validateEmail(email);
    const vp = validatePassword(password, 6);
    const nextErrors = {};
    console.log(ve, vp)
    if (!ve) nextErrors.email = ve.error || 'Email no válido';
    if (!vp) nextErrors.password = vp.error || 'Contraseña inválida';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return; */
    try {
      setSubmitting(true);
      setServerError('');
      const profile = await login({ email, password }); // AuthContext guarda token+user
      redirect({ adminOverride: isAdminRole(profile) });                        // redirige por rol
    } catch (err) {
      setServerError(err?.data?.message || 'Credenciales inválidas');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
    <main className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="bg-white/75 backdrop-blur rounded-xl shadow-sm p-6 md:p-8">
          <header className="text-center mb-6">
            <h1 className="font-serif text-3xl text-(--color-primary1)">Iniciar sesión</h1>
            <p className="text-sm text-(--color-secondary1) mt-1">Bienvenido de vuelta</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="flex items-center gap-2 text-sm text-neutral-700">
                <Mail size={18} />
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none transition focus:border-neutral-500 focus:ring-2 ring-neutral-200"
                placeholder="tu@email.com"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="flex items-center gap-2 text-sm text-neutral-700">
                <Lock size={18} />
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none transition focus:border-neutral-500 focus:ring-2 ring-neutral-200"
                placeholder="••••••••"
                required
              />
            </div>

            {serverError && (
              <p className="text-sm text-red-600 -mt-2">{serverError}</p>
            )}
            <div className='flex flex-col items-center justify-center w-full'> 
              <Button
                type="submit"
                shape="pill"
                motion="lift"
                className="font-regular px-5 mt-2 mb-0 mx-0 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={submitting}
              >
              {submitting ? 'Entrando…' : 'Iniciar sesión'}
            </Button>

                 <div className="mt-3 text-center">
                <Link
                  type="button"
                  onClick={() => navigate(API_PATHS.auth.forgot)}
                  className="text-sm text-muted no-underline hover:opacity-100 hover:text-[var(--color-secondary1)] hover:text-medium transition-colors"
                >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            </div>
       
         </form>

          <footer className="text-center mt-6 pt-6 border-t border-neutral-200">
            <p className="text-sm text-(--color-primary1) opacity-80">
              ¿No tienes una cuenta?{' '}
                <Link to={API_PATHS.auth.register} className="underline text-(--color-primary1) hover:opacity-80">
                Regístrate aquí
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </main>
    </div>
  );
}
