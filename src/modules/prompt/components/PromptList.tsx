import type { PromptListProps } from '../../../common/interfaces/prompt';

export default function PromptList({
  prompts,
  page,
  totalPages,
  onPageChange,
  onCopy,
  onEdit,
}: PromptListProps) {
  return (
    <div class="card-body bg-body-tertiary d-flex flex-column gap-3 overflow-auto p-0">
      <div class="list-group list-group-flush">
        {prompts.map((prompt) => (
          <a class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            key={prompt.id}>
            <div>
              <h6 class="mb-1">{prompt.name}</h6>
              <small class="text-muted">
                {prompt.type} - {prompt.category}
              </small>
            </div>
            <span class="d-flex align-items-center gap-2">
              <button class="icon-btn" onClick={(e) => onCopy(prompt, e)}>
                <i class="fas fa-copy"></i>
              </button>
              <button class="icon-btn" onClick={(e) => onEdit(prompt.id, e)}>
                <i class="fas fa-edit"></i>
              </button>
            </span>
          </a>
        ))}
      </div>
      {totalPages > 1 && (
        <div class="d-flex justify-content-center align-items-center gap-2 py-2">
          <button
            class="btn btn-outline-secondary btn-sm"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}>
            Anterior
          </button>
          <span>
            {page} / {totalPages}
          </span>
          <button
            class="btn btn-outline-secondary btn-sm"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
