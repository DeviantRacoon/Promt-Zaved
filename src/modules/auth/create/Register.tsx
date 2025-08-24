import { getAuth } from 'firebase/auth';
import { useState, useEffect } from 'preact/hooks';
import { route } from 'preact-router';

import { useRegister } from './useRegister';

import Section from '../../../common/components/Section';

import type { RoutableProps } from 'preact-router';

export default function Register(_props: RoutableProps) {
  const { submit, loading, form, touched, change, blur, valid, formValid } = useRegister();

  useEffect(() => {
    if (getAuth().currentUser) route('/dashboard');
  }, [getAuth().currentUser]);

  const [showPwd] = useState(false);
  const [showPwd2] = useState(false);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    submit();
  };

  return (
    <Section className="card-body" aria-labelledby="register-title">
      <article class="d-flex flex-column p-4 justify-content-between h-100 bg-body-tertiary">
        
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
        <header class="text-center mt-3">
          <h1 id="register-title" class="h4 mb-1">Crear cuenta</h1>
          <p class="text-secondary mb-0">Regístrate para comenzar</p>
        </header>

        {/* Alertas */}
        {loading === 'error' && (
          <div class="alert alert-danger mt-3" role="alert">
            Error al crear la cuenta. Inténtalo de nuevo.
          </div>
        )}

        <form class="d-flex flex-column justify-content-center gap-2 mt-3"
          noValidate
          onSubmit={handleSubmit}>
            
          {/* Email */}
          <div class="form-floating">
            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              required
              class={`form-control ${touched.email && !valid.email ? 'is-invalid' : ''}`}
              placeholder="tucorreo@dominio.com"
              value={form.email}
              onInput={change}
              onBlur={blur}
              autoComplete="email"
            />
            <label for="email" class="form-label">Correo electrónico</label>
            <div class="invalid-feedback">Ingresa un correo válido.</div>
          </div>

          {/* Password */}
          <div class="form-floating">
            <input
              id="password"
              name="password"
              type={showPwd ? 'text' : 'password'}
              required
              class={`form-control ${touched.password && !valid.password ? 'is-invalid' : ''}`}
              placeholder="Contraseña"
              value={form.password}
              onInput={change}
              onBlur={blur}
              autoComplete="new-password"
            />
            <label for="password" class="form-label">Contraseña</label>
            <div class="invalid-feedback">La contraseña no cumple los requisitos.</div>
          </div>

          {/* Confirmación */}
          <div class="form-floating">
            <input
              id="confirm"
              name="confirm"
              type={showPwd2 ? 'text' : 'password'}
              required
              class={`form-control ${touched.confirm && !valid.confirm ? 'is-invalid' : ''}`}
              placeholder="Repite la contraseña"
              value={form.confirm}
              onInput={change}
              onBlur={blur}
              autoComplete="new-password"
            />
            <label for="confirm" class="form-label">Confirmar contraseña</label>
            <div class="invalid-feedback">Las contraseñas no coinciden.</div>
          </div>

          {/* Términos */}
          <div class="form-check mt-1">
            <input
              class={`form-check-input ${touched.accept && !valid.accept ? 'is-invalid' : ''}`}
              type="checkbox"
              id="accept"
              name="accept"
              checked={form.accept}
              onInput={change}
              onBlur={blur}
              required
            />
            <label class="form-check-label" for="accept">
              Acepto los <a href="#" class="link-primary">términos y condiciones</a>
            </label>
            <div class="invalid-feedback">Debes aceptar los términos para continuar.</div>
          </div>

          {/* Acciones */}
          <div class="d-grid gap-2 mt-2">
            <button
              type="submit"
              class="btn btn-primary py-2"
              disabled={!formValid || loading === 'loading'}
              aria-busy={loading === 'loading'}>
              {loading === 'loading' ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
            <button
              type="button"
              class="btn btn-outline-secondary"
              onClick={() => route('/')}>
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          </div>
        </form>
      </article>
    </Section>
  );
}