import { useMemo, useState, useEffect } from 'preact/hooks';
import type { RoutableProps } from 'preact-router';

import { route } from 'preact-router';
import Section from '../../common/components/Section';
import Layout from './_layout';
import { usePrompt } from './usePrompt';
import type { PromptForm } from '../../common/interfaces/prompt';

export default function CreatePrompt(props: RoutableProps & { id?: string }) {
  const { id } = props as { id?: string };
  const { createPrompt, updatePrompt, getPrompt } = usePrompt();

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
    name: false,
    category: false,
    type: false,
    model: false,
    tags: false,
    prompt: false,
    notes: false,
    isPublic: false,
  });

  useEffect(() => {
    if (id) {
      const existing = getPrompt(id);
      if (existing) {
        const { id: _id, ...rest } = existing;
        setForm({ ...rest });
      }
    }
  }, [id, getPrompt]);

  const onInput = (e: Event) => {
    const t = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const { name, type } = t;
    let value: any = t.value;

    if (type === 'number' || t.getAttribute('inputmode') === 'numeric') {
      value = Number(value);
    }
    if (type === 'checkbox') {
      value = (t as HTMLInputElement).checked;
    }
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onBlur = (e: Event) => {
    const t = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    setTouched(prev => ({ ...prev, [t.name]: true }));
  };

  const nameOk = form.name.trim().length >= 3;
  const catOk = form.category.trim().length > 0;
  const typeOk = form.type.trim().length > 0;
  const promptOk = form.prompt.trim().length >= 10;

  const formValid = nameOk && catOk && typeOk && promptOk;

  const charCount = useMemo(() => form.prompt.length, [form.prompt]);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setTouched({
      name: true,
      category: true,
      type: true,
      model: true,
      tags: true,
      prompt: true,
      notes: true,
      isPublic: true,
    });

    if (!formValid) return;

    if (id) {
      updatePrompt(id, form);
    } else {
      createPrompt(form);
    }
    route('/dashboard');
  };

  return (
    <Section className="card-body" aria-labelledby="create-prompt-title">
      <Layout>
        <form class="card-body d-flex flex-column gap-3 overflow-auto p-0" noValidate onSubmit={handleSubmit}>
          {/* Nombre */}
          <div class="form-floating">
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
            />
            <label for="name">Nombre</label>
            <div class="invalid-feedback">Mínimo 3 caracteres.</div>
          </div>

          {/* Fila tipo/categoría/modelo */}
          <div class="row g-2" style={{ maxWidth: '100%' }}>
            <div class="col-6">
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
                  <option value="Instruction">Instruction</option>
                  <option value="Chat">Chat</option>
                  <option value="Tool">Tool</option>
                  <option value="System">System</option>
                </select>
                <label for="type">Tipo</label>
                <div class="invalid-feedback">Selecciona un tipo.</div>
              </div>
            </div>

            <div class="col-6">
              <div class="form-floating">
                <select
                  id="category"
                  name="category"
                  class={`form-select ${touched.category && !catOk ? 'is-invalid' : ''}`}
                  value={form.category}
                  onInput={onInput}
                  onBlur={onBlur}
                  required>
                  <option value="" disabled>Elige categoría</option>
                  <option value="General">General</option>
                  <option value="UX/UI">UX/UI</option>
                  <option value="Backend">Backend</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Data">Data</option>
                </select>
                <label for="category">Categoría</label>
                <div class="invalid-feedback">Selecciona una categoría.</div>
              </div>
            </div>

            <div class="col-12">
              <div class="form-floating">
                <select
                  id="model"
                  name="model"
                  class="form-select"
                  value={form.model}
                  onInput={onInput}
                  onBlur={onBlur}
                >
                  <option value="gpt-4o-mini">gpt-4o-mini</option>
                  <option value="gpt-4.1-mini">gpt-4.1-mini</option>
                  <option value="gpt-4o">gpt-4o</option>
                  <option value="o3-mini">o3-mini</option>
                </select>
                <label for="model">Modelo</label>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div class="form-floating">
            <input
              id="tags"
              name="tags"
              type="text"
              class="form-control"
              placeholder="etiquetas separadas por coma"
              value={form.tags}
              onInput={onInput}
              onBlur={onBlur}
            />
            <label for="tags">Etiquetas (coma , separadas)</label>
            <div class="form-text">Ej: ux, accesibilidad, bootstrap</div>
          </div>

          {/* Prompt */}
          <div class="form-floating">
            <textarea
              id="prompt"
              name="prompt"
              class={`form-control ${touched.prompt && !promptOk ? 'is-invalid' : ''}`}
              placeholder="Escribe el prompt…"
              style={{ height: 160 }}
              value={form.prompt}
              onInput={onInput}
              onBlur={onBlur}
              required
            />
            <label for="prompt">Prompt</label>
            <div class="d-flex justify-content-between">
              <div class="invalid-feedback">Mínimo 10 caracteres.</div>
              <small class="text-muted ms-auto">{charCount} caracteres</small>
            </div>
          </div>

          {/* Notas */}
          <div class="form-floating">
            <textarea
              id="notes"
              name="notes"
              class="form-control"
              placeholder="Notas internas…"
              style={{ height: 100 }}
              value={form.notes}
              onInput={onInput}
              onBlur={onBlur}
            />
            <label for="notes">Notas (opcional)</label>
          </div>

          {/* Privacidad */}
          <div class="form-check">
            <input
              id="isPublic"
              name="isPublic"
              type="checkbox"
              class="form-check-input"
              checked={form.isPublic}
              onInput={onInput}
              onBlur={onBlur}
            />
            <label for="isPublic" class="form-check-label">Hacer público</label>
          </div>

          {/* Vista previa */}
          <div class="card">
            <div class="card-header bg-body-secondary">
              <strong>Vista previa</strong>
            </div>
            <div class="card-body">
              <p class="mb-1"><strong>{form.name || 'Sin título'}</strong></p>
              <small class="text-muted d-block mb-2">
                {form.type || '—'} · {form.category || '—'} · {form.model}
              </small>
              <pre class="bg-body-tertiary p-2 rounded" style={{ whiteSpace: 'pre-wrap' }}>
                {form.prompt || 'Aquí verás una vista previa de tu prompt.'}
              </pre>
              {form.tags.trim() && (
                <div class="mt-2 d-flex flex-wrap gap-1">
                  {form.tags.split(',').map((t, i) => (
                    <span key={i} class="badge text-bg-secondary">{t.trim()}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-sm">
            Guardar
          </button>
        </form>
      </Layout>
    </Section>
  );
}
