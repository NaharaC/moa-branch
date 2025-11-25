import { useState } from 'react'
import Swal from 'sweetalert2'
import { Mail } from 'lucide-react'
import { requestPasswordReset } from '../../../services/auth.api.js'

export default function ForgotPasswordPage(){
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    // validación simple
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!okEmail) {
      Swal.fire({ icon: 'error', title: 'Correo inválido', text: 'Ingresa un correo válido.' })
      return
    }

    setLoading(true)
    try {
      await requestPasswordReset(email.trim())
      await Swal.fire({
        icon: 'success',
        title: 'Correo enviado',
        text: 'Si el correo existe, recibirás instrucciones para restablecer tu contraseña.',
        confirmButtonText: 'Entendido'
      })
      // Mantener en la misma página; si prefieres, redirige a /login
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'No se pudo enviar', text: err.message || 'Intenta nuevamente.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-100px)] grid place-items-center px-6 py-12 bg-gradient-to-br from-[var(--color-light-beige,#f6efe7)] to-[var(--color-beige,#e9dccb)]">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-center text-3xl font-semibold text-[var(--color-text-primary,#1f1f1f)]">
            ¿Olvidaste tu contraseña?
          </h1>
          <p className="mt-1 text-center text-sm text-[var(--color-text-muted,#6b7280)]">
            Te enviaremos un enlace para restablecerla
          </p>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="email" className="inline-flex items-center gap-2 text-sm font-medium">
                <Mail size={18} /> Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full rounded-md border border-[var(--color-border,#e5e7eb)] px-3 py-2 outline-none focus:border-[var(--color-primary1,#6B5444)] focus:ring-2 focus:ring-[rgba(68,49,20,0.15)]"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="mt-2 inline-flex items-center justify-center rounded-md bg-[var(--color-primary1,#6B5444)] px-4 py-2 font-semibold text-white shadow-sm transition hover:brightness-105 hover:-translate-y-0.5 active:translate-y-px disabled:opacity-60"
            >
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
