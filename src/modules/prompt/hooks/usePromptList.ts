import { useState, useMemo, useEffect } from 'preact/hooks';
import type { Prompt } from '../../../common/interfaces/prompt';

export function usePromptList(prompts: Prompt[]) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      prompts.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) &&
          (!typeFilter || p.type === typeFilter) &&
          (!categoryFilter || p.category === categoryFilter)
      ),
    [prompts, search, typeFilter, categoryFilter]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / 50));

  const paginated = useMemo(
    () => filtered.slice((page - 1) * 50, page * 50),
    [filtered, page]
  );

  useEffect(() => {
    setPage(1);
  }, [search, typeFilter, categoryFilter]);

  return {
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    page,
    setPage,
    prompts: paginated,
    totalPages,
  } as const;
}
