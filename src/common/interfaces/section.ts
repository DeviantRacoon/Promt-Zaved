import type { ReactNode } from 'preact/compat';
import type { RoutableProps } from 'preact-router';

export interface SectionProps extends RoutableProps {
  children: ReactNode;
  width?: string | number;
  height?: string | number;
  className?: string;
}
