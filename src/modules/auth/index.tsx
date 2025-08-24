import { getAuth } from 'firebase/auth';
import { useEffect } from 'preact/hooks';
import { route } from "preact-router";

import { useAuth } from "./useLogin";
import Section from "../../common/components/Section";

export default function Login({ path }: { path: string }) {
  const { loading, change, submit, form, setStep, step, signInWithGoogle } = useAuth();

  useEffect(() => {
    if (getAuth().currentUser) route('/dashboard');
  }, [getAuth().currentUser]);

  return (
    <Section className="card-body" path={path}>
      <article className="d-flex flex-column p-4 justify-content-between h-100 bg-body-tertiary" aria-live="polite">

        {/* Logo */}
        <div class="text-center">
          <img
            src="/logo.svg"
            alt="Logo de Prompt Saver"
            class="rounded-circle d-inline-block"
            style={{ width: 56, height: 56 }}
            title="Logo"
          />
        </div>

        {/* Encabezado */}
        <header className="text-center mt-3">
          <h1 id="login-title" className="h4 mb-1">Iniciar sesión</h1>
          <p className="text-secondary mb-0">Accede con tu cuenta para continuar</p>
        </header>

        {loading === 'error' && (
          <div className="alert alert-danger mt-3" role="alert">
            Usuario o contraseña incorrectos.
          </div>
        )}

        {/* Formulario por pasos (UI, sin lógica de auth) */}
        <form id="login-form"
          role="form"
          aria-labelledby="login-title"
          noValidate
          className="d-flex flex-column justify-content-center gap-3"
          onSubmit={(e) => e.preventDefault()}>

          {/* PASO 1: EMAIL */}
          {step === 0 && (
            <div role="group" aria-labelledby="email-label">
              <div className="form-floating w-100">
                <input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  className={`form-control`}
                  placeholder="tucorreo@dominio.com"
                  aria-describedby="email-help"
                  autoFocus
                  value={form.email}
                  onInput={change}
                />
                <label id="email-label" htmlFor="email" className="form-label">Correo electrónico</label>
                <div id="email-help" className="form-text">Usa el correo con el que te registraste.</div>
                <div className="invalid-feedback">Ingresa un correo válido.</div>
              </div>

              {/* Acciones: Siguiente */}
              <div className="d-grid mt-3">
                <button
                  type="button"
                  className="btn btn-primary py-2"
                  aria-label="Siguiente: ir a contraseña"
                  onClick={() => setStep(1)}>
                  Siguiente
                </button>
              </div>

              {/* Alternativas (opcional) */}
              <div className="d-flex align-items-center my-4" aria-hidden="true">
                <hr className="flex-grow-1" />
                <span className="px-2 text-secondary">o</span>
                <hr className="flex-grow-1" />
              </div>

              <div className="d-grid gap-2">
                <button
                  type="button"
                  className="btn btn-outline-info bg-transparent text-info"
                  onClick={signInWithGoogle}
                  aria-label="Iniciar sesión con Google">
                  <i className="fab fa-google me-2" aria-hidden="true"></i>
                  Google
                </button>
              </div>
            </div>
          )}

          {/* PASO 2: PASSWORD */}
          {step === 1 && (
            <div role="group" aria-labelledby="password-group-title">
              <h2 id="password-group-title" className="visually-hidden">Contraseña</h2>

              <div className="form-floating w-100">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className={`form-control`}
                  placeholder="Tu contraseña"
                  aria-describedby="password-help"
                  autoFocus
                  value={form.password}
                  onInput={change}
                />
                <label htmlFor="password" className="form-label">Contraseña</label>
              </div>
              <div className="invalid-feedback">La contraseña es obligatoria.</div>

              {/* Recordarme + Olvidé */}
              <div className="d-flex justify-content-between align-items-center mt-2">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="rememberMe" name="rememberMe" />
                  <label className="form-check-label" htmlFor="rememberMe">Recordarme</label>
                </div>
                <a onClick={() => {route('/forgot-password')}} className="link-primary">¿Olvidaste tu contraseña?</a>
              </div>

              {/* Acciones: Atrás / Iniciar sesión (UI) */}
              <div className="d-grid gap-2 mt-3">
                <button
                  type="button"
                  className="btn btn-outline-primary bg-transparent text-primary"
                  aria-label="Volver al paso anterior"
                  onClick={() => setStep(0)}>
                  Atrás
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  aria-label="Iniciar sesión"
                  onClick={submit}
                  disabled={loading === 'loading'}
                  aria-busy={loading === 'loading'}
                >
                  {loading === 'loading' ? 'Iniciando...' : 'Iniciar sesión'}
                </button>
              </div>
            </div>
          )}

        </form>

        {/* Registro */}
        <p className="text-center mt-4 mb-0">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="link-primary">Crear una cuenta</a>
        </p>
      </article>
    </Section>
  );
}
