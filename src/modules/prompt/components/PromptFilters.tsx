import type { PromptFiltersProps } from '../../../common/interfaces/prompt';
import { CATEGORIES, TYPES } from '../../../common/libs/constant';

export default function PromptFilters({
  search,
  onSearch,
  typeFilter,
  onTypeFilter,
  categoryFilter,
  onCategoryFilter,
}: PromptFiltersProps) {
  const handleClear = () => onSearch('');

  return (
    <section class="bg-body-tertiary px-3 py-2" aria-labelledby="filters-title">
      <h2 id="filters-title" class="visually-hidden">Filtros de búsqueda</h2>

      <form role="search" class="d-flex flex-column gap-2" onSubmit={(e)=>e.preventDefault()}>
        {/* Campo de búsqueda con semántica correcta */}
        <div class="input-group">
          <span class="input-group-text" id="search-addon">
            <i class="fa fa-search" aria-hidden="true"></i>
          </span>
          <input
            id="prompt-search"
            type="search"
            class="form-control"
            placeholder="Buscar"
            aria-label="Buscar prompts"
            aria-describedby="search-addon"
            aria-controls="prompt-list"
            value={search}
            autoComplete="off"
            onInput={(e) => onSearch((e.target as HTMLInputElement).value)}
          />
          <button
            type="button"
            class="btn btn-outline-secondary"
            aria-label="Limpiar búsqueda"
            onClick={handleClear}
            disabled={!search}
            title="Limpiar"
          >
            <i class="fa fa-times-circle" aria-hidden="true"></i>
          </button>
        </div>

        {/* Filtros */}
        <div class="d-flex gap-2">
          <div class="w-100">
            <div class="form-floating">
              <select
                class="form-select"
                id="type-filter"
                aria-label="Filtrar por tipo"
                value={typeFilter}
                onInput={(e) => onTypeFilter((e.target as HTMLSelectElement).value)}
              >
                <option value="">Todos</option>
                {TYPES.map((type) => (
                  <option value={type} key={type}>{type}</option>
                ))}
              </select>
              <label for="type-filter">Filtrar por tipo</label>
            </div>
          </div>

          <div class="w-100">
            <div class="form-floating">
              <select
                class="form-select"
                id="category-filter"
                aria-label="Filtrar por categoría"
                value={categoryFilter}
                onInput={(e) => onCategoryFilter((e.target as HTMLSelectElement).value)}
              >
                <option value="">Todas</option>
                {CATEGORIES.map((category) => (
                  <option value={category} key={category}>{category}</option>
                ))}
              </select>
              <label for="category-filter">Filtrar por categoría</label>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

