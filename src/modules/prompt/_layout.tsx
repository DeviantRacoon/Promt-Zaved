import { getAuth } from 'firebase/auth';
import { route } from 'preact-router';
import { useMemo } from 'preact/hooks';

import PromptFilters from './components/PromptFilters';
import type { LayoutProps } from '../../common/interfaces/prompt';

function getInitials(displayName?: string | null, email?: string | null): string {
  const source = (displayName?.trim() || email?.split('@')[0] || '').trim();
  if (!source) return '??';
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    const s = parts[0];
    return (s[0] + (s[s.length - 1] || '')).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Layout({
  children,
  search = '',
  onSearch = () => {},
  typeFilter = '',
  onTypeFilter = () => {},
  categoryFilter = '',
  onCategoryFilter = () => {},
}: LayoutProps) {
  const user = getAuth().currentUser;
  const pathname = location.pathname; // si prefieres, centraliza en un hook/router store

  const isDashboard = pathname === '/dashboard';
  const isCreate = pathname === '/dashboard/create';
  const isSettings = pathname === '/settings';

  const initials = useMemo(
    () => getInitials(user?.displayName ?? null, user?.email ?? null),
    [user?.displayName, user?.email]
  );

  /** accesible helper para marcar pestaña activa */
  const ariaCurrent = (path: string) => (pathname === path ? 'page' : undefined);

  return (
    <article
      class="d-flex flex-column w-100"
      style={{
        // ocupa toda la altura visible del popup/página de extensión
        minHeight: '100dvh',
        // respeta notches en navegadores que soportan safe-area
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* Skip link para teclado/AT */}
      <a class="visually-hidden-focusable" href="#main-content">Saltar al contenido</a>

      {/* Header */}
      <header class="bg-body-secondary border-bottom">
        <div class="container-fluid py-2 px-3 d-flex align-items-center justify-content-between gap-2">
          <h1 class="h6 m-0 text-truncate" aria-label="Prompt Saver">Prompt Saver</h1>

          {!isSettings && (
            <div class="d-flex align-items-center gap-2">
              {isDashboard ? (
                <>
                  <button
                    type="button"
                    class="btn btn-sm btn-primary d-inline-flex align-items-center gap-2"
                    onClick={() => route('/dashboard/create')}
                    aria-label="Crear nuevo prompt"
                  >
                    <i class="fas fa-plus" aria-hidden="true"></i>
                    <span class="d-none d-sm-inline">Nuevo</span>
                  </button>

                  {/* Avatar por iniciales */}
                  <span
                    class="bg-body-tertiary rounded-circle d-inline-flex align-items-center justify-content-center"
                    style={{ width: 28, height: 28, fontSize: 12, border: '1px solid var(--bs-border-color)' }}
                    title={user?.displayName || user?.email || 'Usuario'}
                    aria-label={`Usuario: ${user?.displayName || user?.email || 'desconocido'}`}
                  >
                    <span class="text-center fw-semibold">{initials}</span>
                  </span>
                </>
              ) : (
                <button
                  type="button"
                  class="btn btn-outline-secondary btn-sm"
                  onClick={() => route('/dashboard')}
                  aria-label="Cancelar y volver al tablero"
                >
                  Cancelar
                </button>
              )}
            </div>
          )}
        </div>

        {/* Filtros solo en dashboard */}
        {isDashboard && (
          <div class="border-top">
            <PromptFilters
              search={search}
              onSearch={onSearch}
              typeFilter={typeFilter}
              onTypeFilter={onTypeFilter}
              categoryFilter={categoryFilter}
              onCategoryFilter={onCategoryFilter}
            />
          </div>
        )}
      </header>

      {/* Contenido scrollable */}
      <main
        id="main-content"
        class="flex-fill bg-body-tertiary overflow-auto"
        // asegura que el footer no tape el contenido en móviles/chicos
        tabIndex={-1}>
        <div class="container-fluid py-3">
          {children}
        </div>
      </main>

      {/* Footer nav: usa botones semánticos, no <a> sin href */}
      <footer class="bg-body-secondary border-top position-sticky bottom-0 w-100" role="contentinfo" style={{ zIndex: 10 }}>
        <nav class="container-fluid" aria-label="Navegación principal">
          <ul class="nav nav-pills nav-fill m-0">
            <li class="nav-item">
              <button
                type="button"
                class={`nav-link ${isDashboard ? 'active' : ''}`}
                aria-current={ariaCurrent('/dashboard')}
                aria-label="Listado"
                onClick={() => route('/dashboard')}
              >
                <i class="fas fa-list" aria-hidden="true"></i>
                <span class="visually-hidden">Listado</span>
              </button>
            </li>
            <li class="nav-item">
              <button
                type="button"
                class={`nav-link ${isCreate ? 'active' : ''}`}
                aria-current={ariaCurrent('/dashboard/create')}
                aria-label="Crear"
                onClick={() => route('/dashboard/create')}
              >
                <i class="fas fa-wand-magic-sparkles" aria-hidden="true"></i>
                <span class="visually-hidden">Crear</span>
              </button>
            </li>
            <li class="nav-item">
              <button
                type="button"
                class={`nav-link ${isSettings ? 'active' : ''}`}
                aria-current={ariaCurrent('/settings')}
                aria-label="Ajustes"
                onClick={() => route('/settings')}
              >
                <i class="fas fa-gears fs-5" aria-hidden="true"></i>
                <span class="visually-hidden">Ajustes</span>
              </button>
            </li>
          </ul>
        </nav>
      </footer>
    </article>
  );
}
