import type { PromptFiltersProps } from '../../../common/interfaces/prompt';

export default function PromptFilters({
  search,
  onSearch,
  typeFilter,
  onTypeFilter,
  categoryFilter,
  onCategoryFilter,
}: PromptFiltersProps) {
  return (
    <div class="d-flex flex-column gap-2 bg-body-tertiary px-3 py-2">
      <div class="d-flex gap-2">
        <div class="w-100 position-relative">
          <i
            class="fas fa-search position-absolute top-50 start-0 translate-middle-y px-2 text-muted"
            style={{ zoom: 0.8 }}
          ></i>
          <input
            type="text"
            class="form-control ps-4"
            id="prompt-input"
            placeholder="Buscar"
            value={search}
            onInput={(e) => onSearch((e.target as HTMLInputElement).value)}
          />
        </div>
      </div>
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
              <option value="Instruction">Instruction</option>
              <option value="Chat">Chat</option>
              <option value="Tool">Tool</option>
              <option value="System">System</option>
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
              <option value="">Categoría</option>
              <option value="General">General</option>
              <option value="UX/UI">UX/UI</option>
              <option value="Backend">Backend</option>
              <option value="Marketing">Marketing</option>
              <option value="Data">Data</option>
            </select>
            <label for="category-filter">Filtrar por categoría</label>
          </div>
        </div>
      </div>
    </div>
  );
}
