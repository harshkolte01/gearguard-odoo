import { Pagination as PaginationType } from '@/lib/types';

interface PaginationProps {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export default function Pagination({ pagination, onPageChange, onLimitChange }: PaginationProps) {
  const { page, limit, total, totalPages } = pagination;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (page > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="pagination">
      <div className="pagination-info">
        <span className="pagination-text">
          Showing {startItem} to {endItem} of {total} results
        </span>
        {onLimitChange && (
          <div className="pagination-limit">
            <label htmlFor="limit-select" className="pagination-label">
              Per page:
            </label>
            <select
              id="limit-select"
              className="pagination-select"
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        )}
      </div>

      <div className="pagination-controls">
        <button
          className="pagination-button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Previous
        </button>

        <div className="pagination-pages">
          {getPageNumbers().map((pageNum, index) =>
            pageNum === '...' ? (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                ...
              </span>
            ) : (
              <button
                key={pageNum}
                className={`pagination-page ${page === pageNum ? 'pagination-page-active' : ''}`}
                onClick={() => onPageChange(pageNum as number)}
              >
                {pageNum}
              </button>
            )
          )}
        </div>

        <button
          className="pagination-button"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
        >
          Next
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}


