import type { PromptListProps } from '../../../common/interfaces/prompt';

export default function PromptList({
  prompts,
  page,
  totalPages,
  onPageChange,
  onCopy,
  onEdit,
}: PromptListProps) {
  const announce = (msg: string) => {
    const region = document.getElementById('list-updates');
    if (region) region.textContent = msg;
  };

  const handleCopy = (prompt: any, e: Event) => {
    onCopy(prompt, e);
    announce(`“${prompt.name}” copiado al portapapeles.`);
  };

  const handleEdit = (prompt: any, e: Event) => {
    onEdit(prompt.id, e);
    announce(`Editando “${prompt.name}”.`);
  };

  return (
    <section
      class="card-body bg-body-tertiary d-flex flex-column gap-3 overflow-auto p-0"
      aria-labelledby="list-title"
    >
      <h2 id="list-title" class="visually-hidden">Listado de prompts</h2>
      <div id="list-updates" class="visually-hidden" aria-live="polite"></div>

      {/* Empty state */}
      {(!prompts || prompts.length === 0) ? (
        <div class="text-center text-body-secondary py-5">
          <i class="fa fa-inbox" aria-hidden="true" style="font-size:2rem;"></i>
          <p class="mt-2 mb-0">No hay resultados.</p>
          <small>Prueba limpiar la búsqueda o cambiar filtros.</small>
        </div>
      ) : (
        <ul class="list-group" id="prompt-list" role="list" aria-describedby="list-desc">
          <span id="list-desc" class="visually-hidden">
            {`Se muestran ${prompts.length} elementos en la página ${page} de ${totalPages}.`}
          </span>

          {prompts.map((prompt) => {
            const itemId = `prompt-${prompt.id}`;
            const metaId = `${itemId}-meta`;

            return (
              <li
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-start"
                key={prompt.id}
                id={itemId}
                role="listitem"
                tabIndex={0}
                aria-describedby={metaId}
              >
                <div class="me-3 flex-grow-1">
                  <p class="fw-semibold mb-1 text-truncate-2">{prompt.name}</p>
                  <small id={metaId} class="text-muted">
                    {prompt.type} · {prompt.category}
                  </small>
                </div>

                <div class="btn-group" role="group" aria-label={`Acciones para ${prompt.name}`}>
                  <button
                    type="button"
                    class="btn btn-sm icon-btn"
                    aria-label={`Copiar ${prompt.name}`}
                    title="Copiar"
                    onClick={(e) => handleCopy(prompt, e as any)}>
                    <i class="fa fa-clipboard" aria-hidden="true"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm icon-btn"
                    aria-label={`Editar ${prompt.name}`}
                    title="Editar"
                    onClick={(e) => handleEdit(prompt, e as any)}>
                    <i class="fa fa-pencil" aria-hidden="true"></i>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {totalPages > 1 && (
        <nav class="py-2" aria-label="Paginación de resultados">
          <ul class="pagination pagination-sm justify-content-center mb-0">
            <li class={`page-item ${page === 1 ? 'disabled' : ''}`}>
              <button
                class="page-link"
                onClick={() => onPageChange(page - 1)}
                aria-label="Página anterior"
                aria-disabled={page === 1}
              >
                Anterior
              </button>
            </li>
            <li class="page-item disabled">
              <span class="page-link" aria-current="page">
                Página {page} de {totalPages}
              </span>
            </li>
            <li class={`page-item ${page === totalPages ? 'disabled' : ''}`}>
              <button
                class="page-link"
                onClick={() => onPageChange(page + 1)}
                aria-label="Página siguiente"
                aria-disabled={page === totalPages}
              >
                Siguiente
              </button>
            </li>
          </ul>
        </nav>
      )}
    </section>
  );
}

