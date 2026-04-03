import { Eye, Trash2, Image as ImageIcon, FileText, File } from 'lucide-react'

import { Button } from '#/components/ui/button'
import type { Source } from './workspace-context'
import { cn } from '#/lib/utils'

type WorkspaceSourceItemProps = {
  source: Source
  isActive: boolean
  onSelect: (source: Source) => void
  onPreview: (source: Source) => void
  onDelete: (source: Source) => void
}

function getIcon(kind: Source['kind']) {
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
  const kindLabel =
    source.kind === 'image'
      ? 'Ảnh'
      : source.kind === 'pdf'
      ? 'PDF'
      : source.kind === 'text'
      ? 'Văn bản'
      : 'Tệp'

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={() => onSelect(source)}
        className={cn(
          'w-full rounded-xl border px-3 py-2.5 pr-24 text-left transition-all',
          isActive
            ? 'border-sidebar-ring bg-accent shadow-sm'
            : 'border-sand bg-background hover:border-sidebar-ring/40 hover:bg-sidebar-accent/70',
        )}
      >
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'rounded-lg border p-2 text-muted-foreground transition-colors',
              isActive ? 'border-sidebar-ring/30 bg-background' : 'border-sand bg-background',
            )}
          >
            {getIcon(source.kind)}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-sidebar-foreground">
              {source.name}
            </p>
            <div className="mt-0.5 flex items-center gap-2">
              <p className="text-xs text-muted-foreground">
                {source.exercises.length} bài tập
              </p>
              <span className="rounded-full border border-sand px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {kindLabel}
              </span>
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
          aria-label={`Xem ${source.name}`}
        >
          <Eye className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="icon-xs"
          onClick={() => onDelete(source)}
          className="rounded-md border border-sand bg-background text-destructive hover:text-destructive"
          aria-label={`Xóa ${source.name}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
