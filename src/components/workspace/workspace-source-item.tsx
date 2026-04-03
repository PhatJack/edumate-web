import { Eye, Trash2, Image as ImageIcon, FileText, File } from 'lucide-react'

import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'
import type { Document } from '#/api/types'

type WorkspaceSourceItemProps = {
  source: Document
  isActive: boolean
  onSelect: (source: Document) => void
  onPreview: (source: Document) => void
  onDelete: (source: Document) => void
}

function getIcon(kind: Document['kind']) {
  switch (kind) {
    case 'image':
      return <ImageIcon className="h-4 w-4" />
    case 'pdf':
      return <File className="h-4 w-4" />
    case 'text':
      return <FileText className="h-4 w-4" />
    default:
      return <File className="h-4 w-4" />
  }
}

export function WorkspaceSourceItem({
  source,
  isActive,
  onSelect,
  onPreview,
  onDelete,
}: WorkspaceSourceItemProps) {
  return (
    <div className="group relative">
      <button
        type="button"
        onClick={() => onSelect(source)}
        className={cn(
          'w-full rounded-xl border px-3 py-2.5 pr-24 text-left transition-all',
          isActive
            ? 'border-sidebar-ring bg-accent shadow-sm'
            : 'border-border bg-background hover:border-sidebar-ring/40 hover:bg-sidebar-accent/40',
        )}
      >
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'rounded-lg border p-2 text-muted-foreground transition-colors',
              isActive
                ? 'border-sidebar-ring/30 bg-background'
                : 'border-sand bg-background',
            )}
          >
            {getIcon(source.kind)}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-sidebar-foreground">
              {source.title}
            </p>
            <div className="mt-0.5 flex items-center gap-2">
              <p className="text-xs text-muted-foreground">
                {source.exercise_count} bài tập
              </p>
            </div>
          </div>
        </div>
      </button>

      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 opacity-0 transition-all group-hover:opacity-100 group-focus-within:opacity-100 group-hover:translate-x-0 group-focus-within:translate-x-0">
        <Button
          type="button"
          variant="secondary"
          size="icon-xs"
          onClick={() => onPreview(source)}
          className="rounded-md border border-sand bg-background"
          aria-label={`Xem ${source.title}`}
        >
          <Eye className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="icon-xs"
          onClick={() => onDelete(source)}
          className="rounded-md border border-sand bg-background text-destructive hover:text-destructive"
          aria-label={`Xóa ${source.title}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
