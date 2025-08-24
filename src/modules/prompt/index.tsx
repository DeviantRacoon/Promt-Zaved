import { route } from "preact-router";
import { useEffect } from 'preact/hooks';

import PromptList from './components/PromptList';
import Section from "../../common/components/Section";
import Layout from "./_layout";

import { usePromptList } from './hooks/usePromptList';
import { usePrompt } from "./usePrompt";

import type { Prompt } from "../../common/interfaces/prompt";

export default function Prompt({ path }: { path: string }) {
  const { prompts, copyPrompt, autofillPrompt } = usePrompt();
  
  const {
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    page,
    setPage,
    prompts: paginatedPrompts,
    totalPages,
  } = usePromptList(prompts);

  const animateIcon = (e: Event) => {
    const el = e.currentTarget as HTMLElement;
    el.animate(
      [{ transform: "scale(0.8)", opacity: 0.7 }, { transform: "scale(1)", opacity: 1 }],
      { duration: 200, easing: "ease-out" }
    );
  };

  const handleCode = (prompt: Prompt, e: Event) => {
    animateIcon(e);
    autofillPrompt(prompt, { autoSend: false });
  };

  const handleCopy = (prompt: Prompt, e: Event) => {
    animateIcon(e);
    copyPrompt(prompt);
  };

  const handleEdit = (id: string, e: Event) => {
    animateIcon(e);
    route(`/dashboard/edit/${id}`);
  };

  useEffect(() => {
    setPage(1);
  }, [search, typeFilter, categoryFilter]);

  return (
    <Section className="card-body" path={path}>
      <Layout
        search={search}
        onSearch={setSearch}
        typeFilter={typeFilter}
        onTypeFilter={setTypeFilter}
        categoryFilter={categoryFilter}
        onCategoryFilter={setCategoryFilter}>
        <PromptList
          prompts={paginatedPrompts}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onCopy={handleCopy}
          onEdit={handleEdit}
          onFill={handleCode}
        />
      </Layout>
    </Section>
  );
}

