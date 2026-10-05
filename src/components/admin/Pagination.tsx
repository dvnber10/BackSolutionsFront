import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import './Pagination.scss';

type PaginationProps = {
  page: number;
  totalPages: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
  onPage: (page: number) => void;
};

export function Pagination({
  page,
  totalPages,
  totalCount,
  hasPrevious,
  hasNext,
  onPage,
}: PaginationProps) {
  if (totalPages <= 1) {
    return (
      <p className="pagination pagination--single">
        {totalCount} {totalCount === 1 ? 'resultado' : 'resultados'}
      </p>
    );
  }

  return (
    <div className="pagination">
      <Button
        variant="secondary"
        size="sm"
        disabled={!hasPrevious}
        onClick={() => onPage(page - 1)}
      >
        <ChevronLeft size={16} aria-hidden="true" />
        Anterior
      </Button>
      <span className="pagination__status">
        Página {page} de {totalPages} · {totalCount} resultados
      </span>
      <Button variant="secondary" size="sm" disabled={!hasNext} onClick={() => onPage(page + 1)}>
        Siguiente
        <ChevronRight size={16} aria-hidden="true" />
      </Button>
    </div>
  );
}
