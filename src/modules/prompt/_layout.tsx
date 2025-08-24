import { getAuth } from 'firebase/auth';
import { route } from "preact-router";

import PromptFilters from './components/PromptFilters';

import type { LayoutProps } from '../../common/interfaces/prompt';

export default function Layout({
  children,
  search = "",
  onSearch = () => {},
  typeFilter = "",
  onTypeFilter = () => {},
  categoryFilter = "",
  onCategoryFilter = () => {},
}: LayoutProps) {
  const isDashboard = location.pathname === "/dashboard";
  const isSettings = location.pathname === "/settings";
  const user = getAuth().currentUser;
  const userName = user?.displayName ? `${user.displayName[0]}${user.displayName[user.displayName.length - 1]}` : "404";

  return (
    <article class="card border-0 shadow-0 rounded-0 h-100">
      <header class="card-header bg-body-secondary d-flex justify-content-between">
        <p class="card-header-title fw-bold">Prompt Saver</p>
        <span class="d-flex align-items-center gap-2">
          {!isSettings && (
            <>
              {isDashboard ? (<>
                <button class="btn btn-sm btn-primary" onClick={() => route("/dashboard/create")}>
                  <i class="fas fa-plus"></i>
                  Nuevo
                </button>
                <span class="bg-body-secondary rounded-circle d-flex align-items-center justify-content-center" style={{ width: 24, height: 24, fontSize: 12 }} title="Logo">
                  <span class="text-center">{userName}</span>
                </span>
              </>
              ) : (
                <>
                  <button type="button" class="btn btn-outline-secondary btn-sm" onClick={() => route("/dashboard")}>
                    Cancelar
                  </button>
                </>
              )}
            </>
          )}
        </span>
      </header>

      {isDashboard && (
        <PromptFilters
          search={search}
          onSearch={onSearch}
          typeFilter={typeFilter}
          onTypeFilter={onTypeFilter}
          categoryFilter={categoryFilter}
          onCategoryFilter={onCategoryFilter}
        />
      )}

      <div class="card-body bg-body-tertiary d-flex flex-column gap-3 overflow-auto">
        {children}
      </div>

      <footer class="card-footer bg-body-secondary position-sticky bottom-0 rounded-0" style={{ zIndex: 10 }}>
        <nav class="nav nav-pills nav-fill">
          <a onClick={() => route("/dashboard")} class={`nav-link ${location.pathname === "/dashboard" ? "active" : ""}`} aria-current={location.pathname === "/dashboard" ? "page" : undefined} style={{ cursor: "pointer" }}>
            <i class="fas fa-list"></i>
          </a>
          <a onClick={() => route("/dashboard/create")} class={`nav-link ${location.pathname === "/dashboard/create" ? "active" : ""}`} aria-current={location.pathname === "/dashboard/create" ? "page" : undefined} style={{ cursor: "pointer" }}>
            <i class="fas fa-wand-magic-sparkles"></i>
          </a>
          <a onClick={() => route("/settings")} class={`nav-link ${location.pathname === "/settings" ? "active" : ""}`} aria-current={location.pathname === "/prompt/settings" ? "page" : undefined} style={{ cursor: "pointer" }}>
            <i class="fas fa-gears fs-5"></i>
          </a>
        </nav>
      </footer>
    </article>
  )
}
