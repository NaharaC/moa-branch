import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { Lock } from 'lucide-react'
import { resetPassword } from '../../../services/auth.api.js'
import { API_PATHS } from '../../../config/api-paths.js'

export default function ResetPasswordPage(){
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const token = params.get('token') // cambiar a useParams()???

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      Swal.fire({ icon: 'error', title: 'Token faltante', text: 'Link inválido o incompleto.' })
        .then(()=> navigate(API_PATHS.auth.forgot))
    }
  }, [token, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    // validaciones mínimas
    if (password.length < 8) {
      Swal.fire({ icon: 'error', title: 'Contraseña muy corta', text: 'Mínimo 8 caracteres.' })
      return
    }
    if (password !== confirm) {
      Swal.fire({ icon: 'error', title: 'No coincide', text: 'Las contraseñas no coinciden.' })
      return
    }

    setLoading(true)
    try {
      await resetPassword({ token, password })
      await Swal.fire({
        icon: 'success',
        title: 'Contraseña restablecida',
        text: 'Ahora puedes iniciar sesión con tu nueva contraseña.',
        confirmButtonText: 'Ir a login',
      })
      navigate('/login')
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'No se pudo restablecer', text: err.message || 'Intenta nuevamente.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-100px)] grid place-items-center px-6 py-12 bg-gradient-to-br from-[var(--color-light-beige,#f6efe7)] to-[var(--color-beige,#e9dccb)]">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-center text-3xl font-semibold text-[var(--color-text-primary,#1f1f1f)]">
            Restablecer contraseña
          </h1>
          <p className="mt-1 text-center text-sm text-[var(--color-text-muted,#6b7280)]">
            Crea una nueva contraseña para tu cuenta
          </p>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            {/* Nueva contraseña */}
            <div className="grid gap-2">
              <label htmlFor="password" className="inline-flex items-center gap-2 text-sm font-medium">
                <Lock size={18} /> Nueva contraseña
              </label>
              <input
                id="password" name="password" type="password"
                value={password} onChange={(e)=>setPassword(e.target.value)}
                placeholder="••••••••" required
                className="w-full rounded-md border border-[var(--color-border,#e5e7eb)] px-3 py-2 outline-none focus:border-[var(--color-primary1,#6B5444)] focus:ring-2 focus:ring-[rgba(68,49,20,0.15)]"
              />
              <p className="text-xs text-[var(--color-text-secondary,#4b5563)]">Mínimo 8 caracteres.</p>
            </div>

            {/* Confirmación */}
            <div className="grid gap-2">
              <label htmlFor="confirm" className="inline-flex items-center gap-2 text-sm font-medium">
                <Lock size={18} /> Confirmar contraseña
              </label>
              <input
                id="confirm" name="confirm" type="password"
                value={confirm} onChange={(e)=>setConfirm(e.target.value)}
                placeholder="••••••••" required
                className="w-full rounded-md border border-[var(--color-border,#e5e7eb)] px-3 py-2 outline-none focus:border-[var(--color-primary1,#6B5444)] focus:ring-2 focus:ring-[rgba(68,49,20,0.15)]"
              />
            </div>

            <button
              type="submit" disabled={loading || !token}
              className="mt-2 inline-flex items-center justify-center rounded-md bg-[var(--color-primary1,#6B5444)] px-4 py-2 font-semibold text-white shadow-sm transition hover:brightness-105 hover:-translate-y-0.5 active:translate-y-px disabled:opacity-60"
            >
              {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
