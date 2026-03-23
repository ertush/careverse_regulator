import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { PaginationMeta } from '@/types/inspection'

interface PaginationControlsProps {
  pagination: PaginationMeta | null
  onPageChange: (page: number) => void
  isMobile?: boolean
}

export default function PaginationControls({ pagination, onPageChange, isMobile }: PaginationControlsProps) {
  if (!pagination || pagination.total_pages <= 1) {
    return null
  }

  const { page, total_pages, has_prev, has_next, total_count } = pagination

  const pageNumbers = []
  const maxVisible = isMobile ? 3 : 5
  let start = Math.max(1, page - Math.floor(maxVisible / 2))
  let end = Math.min(total_pages, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pageNumbers.push(i)
  }

  return (
    <div className={cn(
      'flex items-center justify-between border-t border-border',
      isMobile ? 'mt-6 pt-3' : 'mt-6 pt-4'
    )}>
      <div className={cn(
        'text-muted-foreground',
        isMobile ? 'text-xs' : 'text-sm'
      )}>
        Showing {total_count > 0 ? (page - 1) * pagination.page_size + 1 : 0} to{' '}
        {Math.min(page * pagination.page_size, total_count)} of {total_count} results
      </div>

      <div className="flex gap-2 items-center">
        <Button
          variant="outline"
          size={isMobile ? 'sm' : 'default'}
          disabled={!has_prev}
          onClick={() => onPageChange(page - 1)}
          className={cn('px-2', isMobile ? 'h-8' : 'h-9')}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {start > 1 && (
          <>
            <Button
              variant="outline"
              size={isMobile ? 'sm' : 'default'}
              onClick={() => onPageChange(1)}
              className={cn('min-w-8', isMobile ? 'h-8' : 'h-9')}
            >
              1
            </Button>
            {start > 2 && <span className="px-1">...</span>}
          </>
        )}

        {pageNumbers.map((pageNum) => (
          <Button
            key={pageNum}
            variant={pageNum === page ? 'default' : 'outline'}
            size={isMobile ? 'sm' : 'default'}
            onClick={() => onPageChange(pageNum)}
            className={cn('min-w-8', isMobile ? 'h-8' : 'h-9')}
          >
            {pageNum}
          </Button>
        ))}

        {end < total_pages && (
          <>
            {end < total_pages - 1 && <span className="px-1">...</span>}
            <Button
              variant="outline"
              size={isMobile ? 'sm' : 'default'}
              onClick={() => onPageChange(total_pages)}
              className={cn('min-w-8', isMobile ? 'h-8' : 'h-9')}
            >
              {total_pages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size={isMobile ? 'sm' : 'default'}
          disabled={!has_next}
          onClick={() => onPageChange(page + 1)}
          className={cn('px-2', isMobile ? 'h-8' : 'h-9')}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
