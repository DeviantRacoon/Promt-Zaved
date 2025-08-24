import Section from "../../../common/components/Section";
import { route } from "preact-router";
import { useForgotPassword } from "./useForgotPassword";

export default function ForgotPassword({ path }: { path: string }) {
  const { form, submit, loading, change } = useForgotPassword();

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    submit();
  };

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
          <h1 id="fp-title" className="h4 mb-1">Recuperar contraseña</h1>
          <p className="text-secondary mb-0">
            Escribe tu correo y te enviaremos un enlace para restablecerla.
          </p>
        </header>

        {/* Formulario */}
        <form
          id="forgot-form"
          role="form"
          aria-labelledby="fp-title"
          noValidate
          className="d-flex flex-column justify-content-center gap-3"
          onSubmit={handleSubmit}>

          <div role="group" aria-labelledby="email-label">
            <div className="form-floating w-100">
              <input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                className={`form-control`}
                required
                placeholder="tucorreo@dominio.com"
                aria-describedby="email-help"
                autoFocus
                value={form.email}
                onInput={change}
              />
              <label id="email-label" htmlFor="email" className="form-label">
                Correo electrónico
              </label>
            </div>
            <div id="email-help" className="form-text">
              Debe ser el correo asociado a tu cuenta.
            </div>
            <div className="invalid-feedback">Ingresa un correo válido.</div>
          </div>

          {/* CTA principal */}
          <button
            type="submit"
            className="btn btn-primary w-100 py-2"
            aria-label="Enviar instrucciones de restablecimiento"
            disabled={loading === 'loading'}
            aria-busy={loading === 'loading'}>
            {loading === 'loading' ? 'Enviando...' : 'Enviar instrucciones'}
          </button>

          {/* Separador visual */}
          <div className="d-flex align-items-center my-3" aria-hidden="true">
            <hr className="flex-grow-1" />
            <span className="px-2 text-secondary">o</span>
            <hr className="flex-grow-1" />
          </div>

          {/* Volver a iniciar sesión (UI, sin navegación real) */}
          <a
            onClick={() => route("/")}
            className="btn btn-outline-secondary w-100"
            role="button"
            aria-label="Volver al inicio de sesión">
            Volver a iniciar sesión
          </a>

          {loading === 'error' && (
            <div className="alert alert-danger" role="alert">
              Error al enviar las instrucciones. Intenta de nuevo.
            </div>
          )}
          <div id="feedback-region" className="visually-hidden" role="status" aria-live="polite" />
        </form>

        {/* Pie / enlaces legales opcionales */}
        <p className="text-center text-secondary mt-4 mb-0" style={{ fontSize: ".875rem" }}>
          ¿Problemas? <a href="#" className="link-secondary">Contactar soporte</a>
        </p>
      </article>
    </Section>
  );
}
