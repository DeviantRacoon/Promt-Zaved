import { useMemo, useState, useEffect } from 'preact/hooks';
import type { RoutableProps } from 'preact-router';
import { route } from 'preact-router';

import Layout from './_layout';
import Section from '../../common/components/Section';

import { CATEGORIES, TYPES } from '../../common/libs/constant';
import { usePrompt } from './usePrompt';
import { useAuthState } from "../../hooks/useAuthState";

import type { PromptForm } from '../../common/interfaces/prompt';

const NAME_MIN = 3;
const PROMPT_MIN = 10;
const NAME_MAX = 120;       // opcional: limita ruido
const PROMPT_MAX = 8000;    // opcional: razonable para prompts largos
const TAGS_MAX = 240;       // opcional

export default function CreatePrompt(props: RoutableProps & { id?: string }) {
  const { id } = props as { id?: string };
  const { user, loading: authLoading } = useAuthState();
  const { createPrompt, updatePrompt, getPrompt, deletePrompt } = usePrompt();

  const [form, setForm] = useState<PromptForm>({
    name: '',
    category: '',
    type: '',
    model: 'gpt-4o-mini',
    tags: '',
    prompt: '',
    notes: '',
    isPublic: false,
  });

  const [touched, setTouched] = useState<Record<keyof PromptForm, boolean>>({
    name: false, category: false, type: false, model: false,
    tags: false, prompt: false, notes: false, isPublic: false,
  });

  const [errorSummary, setErrorSummary] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      const existing = getPrompt(id);
      if (existing) {
        const { id: _id, ...rest } = existing;
        setForm({ ...rest });
      }
    }
  }, [id, getPrompt]);

  useEffect(() => {
    if (!authLoading && !user) route('/');
  }, [authLoading, user]);

  // atajo: Ctrl/Cmd+S para enviar
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        const formEl = document.getElementById('create-prompt-form') as HTMLFormElement | null;
        formEl?.requestSubmit();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const onInput = (e: Event) => {
    const t = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const { name, type } = t;
    let value: any = t.value;

    if (type === 'number' || t.getAttribute('inputmode') === 'numeric') value = Number(value);
    if (type === 'checkbox') value = (t as HTMLInputElement).checked;

    // recortes opcionales para evitar overflow
    if (name === 'name' && typeof value === 'string') value = value.slice(0, NAME_MAX);
    if (name === 'prompt' && typeof value === 'string') value = value.slice(0, PROMPT_MAX);
    if (name === 'tags' && typeof value === 'string') value = value.slice(0, TAGS_MAX);

    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onBlur = (e: Event) => {
    const t = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    setTouched(prev => ({ ...prev, [t.name]: true }));
  };

  // validaciones
  const nameOk = form.name.trim().length >= NAME_MIN;
  const catOk = form.category.trim().length > 0;
  const typeOk = form.type.trim().length > 0;
  const promptOk = form.prompt.trim().length >= PROMPT_MIN;

  const formValid = nameOk && catOk && typeOk && promptOk;

  const charName = useMemo(() => form.name.length, [form.name]);
  const charPrompt = useMemo(() => form.prompt.length, [form.prompt]);
  const charTags = useMemo(() => form.tags.length, [form.tags]);

  const computeErrors = (): string[] => {
    const errs: string[] = [];
    if (!nameOk) errs.push(`Nombre: mínimo ${NAME_MIN} caracteres.`);
    if (!typeOk) errs.push('Tipo: selecciona una opción.');
    if (!catOk) errs.push('Categoría: selecciona una opción.');
    if (!promptOk) errs.push(`Prompt: mínimo ${PROMPT_MIN} caracteres.`);
    return errs;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    setTouched({
      name: true, category: true, type: true, model: true,
      tags: true, prompt: true, notes: true, isPublic: true,
    });

    const errs = computeErrors();
    setErrorSummary(errs);

    if (!formValid) {
      // foco al primer inválido
      const firstInvalid = document.querySelector('.form-control.is-invalid, .form-select.is-invalid') as HTMLElement | null;
      firstInvalid?.focus();
      return;
    }

    if (id) {
      updatePrompt(id, form);
    } else {
      createPrompt(form);
    }
    route('/dashboard');
  };

  const handleDelete = async (e: Event) => {
    e.preventDefault();
    if (!id) return;
    // confirmación mínima; reemplaza por modal si ya tienes
    const ok = confirm('¿Eliminar este prompt? Esta acción no se puede deshacer.');
    if (!ok) return;
    await deletePrompt(id);
    route('/dashboard');
  };

  // etiquetas: limpieza visual para la vista previa
  const parsedTags = useMemo(
    () => form.tags.split(',').map(t => t.trim()).filter(Boolean),
    [form.tags]
  );

  if (authLoading) {
    return (
      <Section className="card-body" path={props.path} aria-busy="true">
        <div className="d-flex justify-content-center align-items-center h-100">
          <span>Cargando...</span>
        </div>
      </Section>
    );
  }

  if (!user) return null;

  return (
    <Section className="card-body" path={props.path} aria-labelledby="create-prompt-title">
      <Layout>
        {/* Contenedor lineal (una columna) pensando en popup de extensión */}
        <div class="container-fluid px-0">
          <form
            id="create-prompt-form"
            class="d-flex flex-column gap-3"
            noValidate
            onSubmit={handleSubmit}
            aria-describedby="form-hint"
          >
            <p id="form-hint" class="visually-hidden">Formulario para crear o editar un prompt.</p>

            {/* Resumen de errores */}
            {errorSummary.length > 0 && (
              <div class="alert alert-danger" role="alert" aria-live="assertive">
                <strong>Revisa los siguientes errores:</strong>
                <ul class="mb-0 mt-1">
                  {errorSummary.map((msg, i) => <li key={i}>{msg}</li>)}
                </ul>
              </div>
            )}

            {/* Nombre */}
            <div class="form-floating position-relative">
              <input
                id="name"
                name="name"
                type="text"
                class={`form-control ${touched.name && !nameOk ? 'is-invalid' : ''}`}
                placeholder="Nombre del prompt"
                value={form.name}
                onInput={onInput}
                onBlur={onBlur}
                required
                minLength={NAME_MIN}
                maxLength={NAME_MAX}
              />
              <label for="name">Nombre</label>
              <span class="position-absolute end-0 bottom-0 translate-middle-y pe-2 text-muted" style="font-size: .75rem;">
                {charName}/{NAME_MAX}
              </span>
              <div class="invalid-feedback">Mínimo {NAME_MIN} caracteres.</div>
            </div>


            {/* Tipo / Categoría */}
            <div class="row g-2">
              <div class="col-12 col-sm-6">
                <div class="form-floating">
                  <select
                    id="type"
                    name="type"
                    class={`form-select ${touched.type && !typeOk ? 'is-invalid' : ''}`}
                    value={form.type}
                    onInput={onInput}
                    onBlur={onBlur}
                    required
                  >
                    <option value="" disabled>Selecciona tipo</option>
                    {TYPES.map((t) => (
                      <option value={t} key={t}>{t}</option>
                    ))}
                  </select>
                  <label for="type">Tipo</label>
                  <div class="invalid-feedback">Selecciona un tipo.</div>
                </div>
              </div>
              <div class="col-12 col-sm-6">
                <div class="form-floating">
                  <select
                    id="category"
                    name="category"
                    class={`form-select ${touched.category && !catOk ? 'is-invalid' : ''}`}
                    value={form.category}
                    onInput={onInput}
                    onBlur={onBlur}
                    required
                  >
                    <option value="" disabled>Elige categoría</option>
                    {CATEGORIES.map((c) => (
                      <option value={c} key={c}>{c}</option>
                    ))}
                  </select>
                  <label for="category">Categoría</label>
                  <div class="invalid-feedback">Selecciona una categoría.</div>
                </div>
              </div>
            </div>

            {/* Modelo */}
            <div class="form-floating">
              <select
                id="model"
                name="model"
                class="form-select"
                value={form.model}
                onInput={onInput}
                onBlur={onBlur}
                aria-label="Modelo del asistente">
                <option value="gpt-4o-mini">gpt-4o-mini</option>
                <option value="gpt-4.1-mini">gpt-4.1-mini</option>
                <option value="gpt-4o">gpt-4o</option>
                <option value="o3-mini">o3-mini</option>
              </select>
              <label for="model">Modelo</label>
            </div>

            {/* Tags */}
            <div class="form-floating position-relative">
              <input
                id="tags"
                name="tags"
                type="text"
                class="form-control pr-counter"
                placeholder="ux, accesibilidad, bootstrap"
                value={form.tags}
                onInput={onInput}
                onBlur={onBlur}
                maxLength={TAGS_MAX}
                autoComplete="off"
                pattern="^[^;|]*$"
                inputMode="text"
                aria-label="Etiquetas separadas por coma"
              />
              <label for="tags">Etiquetas (separadas por coma)</label>

              {/* Contador dentro del input */}
              <span
                class="position-absolute end-0 bottom-0 translate-middle-y pe-2 text-muted"
                style="font-size:.75rem;"
                aria-hidden="true">
                {charTags}/{TAGS_MAX}
              </span>
            </div>


            {/* Prompt */}
            <div class="form-floating position-relative">
              <textarea
                id="prompt"
                name="prompt"
                class={`form-control ${touched.prompt && !promptOk ? 'is-invalid' : ''}`}
                placeholder="Escribe el prompt…"
                style={{ height: 200 }}
                value={form.prompt}
                onInput={onInput}
                onBlur={onBlur}
                required
                minLength={PROMPT_MIN}
                maxLength={PROMPT_MAX}
              />
              <label for="prompt">Prompt</label>
              <span class="position-absolute end-0 bottom-0 mt-2 pe-2 text-muted" style="font-size: .75rem;">
                {charPrompt}/{PROMPT_MAX}
              </span>
              <div class="invalid-feedback">Mínimo {PROMPT_MIN} caracteres.</div>
            </div>


            {/* Notas */}
            <div class="form-floating">
              <textarea
                id="notes"
                name="notes"
                class="form-control"
                placeholder="Notas internas…"
                style={{ height: 120 }}
                value={form.notes}
                onInput={onInput}
                onBlur={onBlur}
                aria-describedby="notes-help"
              />
              <label for="notes">Notas (opcional)</label>
              <div id="notes-help" class="form-text">No se comparten al copiar; solo para ti.</div>
            </div>

            {/* --- VISTA PREVIA AL FINAL --- */}
            <section aria-labelledby="preview-title">
              <div class="card">
                <div class="card-header bg-body-secondary">
                  <strong id="preview-title">Vista previa</strong>
                </div>
                <div class="card-body d-flex flex-column gap-2">
                  <p class="mb-0 text-truncate-2">
                    <strong>{form.name || 'Sin título'}</strong>
                  </p>
                  <small class="text-muted">
                    {(form.type || '—')} · {(form.category || '—')} · {form.model}
                  </small>

                  {/* altura acotada para popup de extensión */}
                  <pre class="bg-body-tertiary p-2 rounded"
                    style={{ whiteSpace: 'pre-wrap', maxHeight: 220, overflow: 'auto' }}>
                    {form.prompt || 'Aquí verás una vista previa de tu prompt.'}
                  </pre>

                  {parsedTags.length > 0 && (
                    <div class="d-flex flex-wrap gap-1">
                      {parsedTags.map((t, i) => (
                        <span key={i} class="badge badge-soft">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Acciones (puedes moverlas ARRIBA o ABAJO del preview a gusto) */}
            <div class="position-sticky bottom-0 py-2 bg-body-tertiary"
              style="z-index:2; border-top: 1px solid var(--bs-border-color);">
              <div class="d-flex gap-2 justify-content-end">
                {id && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    class="btn btn-danger btn-sm"
                    aria-label="Eliminar prompt">
                    <i class="fas fa-trash me-1" aria-hidden="true"></i>
                    Eliminar
                  </button>
                )}
                <button type="submit" class="btn btn-primary btn-sm" aria-label="Guardar prompt">
                  <i class="fas fa-check me-1" aria-hidden="true"></i>
                  Guardar
                </button>
              </div>
            </div>

          </form>
        </div>
      </Layout>
    </Section>
  );

}
