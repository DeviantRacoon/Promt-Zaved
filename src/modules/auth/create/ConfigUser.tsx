import { useState } from "preact/hooks";
import { route } from "preact-router";
import { useRegister } from "./useRegister";

import Section from "../../../common/components/Section";

export default function ConfigUser({ path }: { path: string }) {
  const [username, setUsername] = useState("");
  const { updateUser } = useRegister();

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    updateUser( username );
    route("/dashboard");
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
          <h1 id="fp-title" className="h4 mb-1">Configura tu usuario</h1>
          <p className="text-secondary mb-0">
            Agrega un nombre de usuario para que puedas ser identificado en la plataforma.
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

          <div role="group" aria-labelledby="username-label">
            <div className="form-floating w-100">
              <input
                id="username"
                name="username"
                type="text"
                inputMode="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
                required
                className="form-control"
                placeholder="Tu nombre de usuario"
                aria-describedby="username-help"
                autoFocus
              />
              <label id="username-label" htmlFor="username" className="form-label">
                Nombre de usuario
              </label>
            </div>
            <div id="username-help" className="form-text">
              Debe ser único y no debe contener espacios.
            </div>
          </div>

          {/* CTA principal */}
          <button
            type="submit"
            className="btn btn-primary w-100 py-2"
            aria-label="Guardar username">
            Guardar
          </button>
        </form>
      </article>
    </Section>
  );
}

