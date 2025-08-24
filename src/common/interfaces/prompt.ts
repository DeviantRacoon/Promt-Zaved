import type { JSX } from 'preact';

export interface StoredPrompt {
  id: string;
  text: string;
}

export type Prompt = {
  id: string;
  name: string;
  category: string;
  type: string;
  model: string;
  tags: string;
  prompt: string;
  notes: string;
  isPublic: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PromptForm = Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'userId'>;

export type PromptFiltersProps = {
  search: string;
  onSearch: (v: string) => void;
  typeFilter: string;
  onTypeFilter: (v: string) => void;
  categoryFilter: string;
  onCategoryFilter: (v: string) => void;
};

export type LayoutProps = {
  children: JSX.Element;
} & Partial<PromptFiltersProps>;

export type PromptListProps = {
  prompts: Prompt[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onCopy: (prompt: Prompt, e: Event) => void;
  onEdit: (id: string, e: Event) => void;
  onFill: (prompt: Prompt, e: Event) => void;
};
