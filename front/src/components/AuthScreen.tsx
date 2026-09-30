import { useState, type FormEvent } from 'react'
import { Activity, ArrowRight, Check, CircleHelp, Laptop, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { api } from '../api'
import type { AuthResult } from '../types'

type AuthScreenProps = { onAuthenticated: (token: string, user: AuthResult['user']) => void }

/** Permite crear una cuenta de técnico o iniciar una sesión existente. */
export function AuthScreen({ onAuthenticated }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return
    setError('')
    setSubmitting(true)
    const values = new FormData(event.currentTarget)
    const email = String(values.get('email')).trim()
    const password = String(values.get('password'))
    try {
      const result = mode === 'register'
        ? await api.register({ name: String(values.get('name')).trim(), email, password })
        : await api.login({ email, password })
      onAuthenticated(result.token, result.user)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo completar el acceso.')
    } finally {
      setSubmitting(false)
    }
  }

  return <main className="auth-page">
    <div className="auth-brand"><a className="brand" href="#inicio"><span className="brand-mark"><Activity size={19} strokeWidth={2.4} /></span><span>techtrack<span className="brand-period">.</span></span></a><span className="auth-version">SOPORTE TÉCNICO / 01</span></div>
    <div className="auth-layout">
      <section className="auth-story">
        <div className="story-kicker"><span /> TRAZABILIDAD QUE TRABAJA CONTIGO</div>
        <h1>El contexto<br />de cada <em>reparación.</em></h1>
        <p>Equipos, intervenciones y evidencias conectados en un solo lugar. Para que cada técnico sepa qué sigue y qué se hizo antes.</p>
        <div className="story-flow"><div className="flow-node"><span className="flow-symbol"><Laptop size={18} /></span><span>Equipo</span></div><span className="flow-dash" /><div className="flow-node"><span className="flow-symbol"><Activity size={18} /></span><span>Intervención</span></div><span className="flow-dash" /><div className="flow-node"><span className="flow-symbol"><Check size={18} /></span><span>Historial</span></div></div>
        <div className="story-caption"><span className="caption-mark"><Check size={13} /></span> Cada intervención deja un registro útil para la siguiente.</div>
      </section>
      <section className="auth-card" aria-labelledby="auth-heading">
        <div className="auth-card-top"><span className="auth-card-icon"><LockKeyhole size={17} /></span><span className="secure-label">ACCESO SEGURO</span><button className="auth-help" aria-label="Ayuda" title="Ayuda"><CircleHelp size={17} /></button></div>
        <div className="auth-heading"><div className="eyebrow">{mode === 'login' ? 'QUÉ BUENO VERTE' : 'EMPIEZA AQUÍ'}</div><h2 id="auth-heading">{mode === 'login' ? 'Inicia sesión' : 'Crea tu cuenta'}</h2><p>{mode === 'login' ? 'Accede a tu espacio de trabajo técnico.' : 'Configura tu perfil para empezar a registrar intervenciones.'}</p></div>
        <form className="auth-form" onSubmit={(event) => void handleSubmit(event)}>
          {mode === 'register' && <label>Nombre completo<span className="input-icon"><UserRound size={16} /><input name="name" type="text" autoComplete="name" placeholder="Tu nombre" required maxLength={80} /></span></label>}
          <label>Correo electrónico<span className="input-icon"><Mail size={16} /><input name="email" type="email" autoComplete="email" placeholder="tecnico@empresa.com" required /></span></label>
          <label>Contraseña<span className="input-icon"><LockKeyhole size={16} /><input name="password" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} placeholder={mode === 'register' ? 'Al menos 8 caracteres' : 'Tu contraseña'} minLength={mode === 'register' ? 8 : 1} required /></span></label>
          {error && <div className="auth-error" role="alert">{error}</div>}
          <button className="auth-submit" type="submit" disabled={submitting}>{submitting ? <span className="loader light" /> : <>{mode === 'login' ? 'Entrar a TechTrack' : 'Crear cuenta'}<ArrowRight size={17} /></>}</button>
        </form>
        <div className="auth-switch">{mode === 'login' ? '¿Aún no tienes cuenta?' : '¿Ya tienes una cuenta?'} <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>{mode === 'login' ? 'Regístrate' : 'Inicia sesión'}</button></div>
        <div className="auth-privacy"><LockKeyhole size={13} /> Tu información técnica está protegida y vinculada a tu cuenta.</div>
      </section>
    </div>
    <footer className="auth-footer"><span>TECHTRACK <b>/</b> GESTIÓN DE SERVICIO</span><span>Hecho para el trabajo que mantiene todo en marcha.</span></footer>
  </main>
}