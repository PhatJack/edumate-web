import type { Source } from './workspace-context'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'

function getDocumentTitle(document: Source) {
  return document.name || 'Tài liệu chưa đặt tên'
}

export function DocumentPreviewDialog({
  document,
  open,
  onOpenChange,
}: {
  document: Source | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const isImageDocument = document?.kind === 'image'

  return (
    <Dialog open={open && !!document} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{document ? getDocumentTitle(document) : 'Xem tài liệu'}</DialogTitle>
          <DialogDescription>
            {isImageDocument ? 'Bản xem trước tài liệu dạng ảnh.' : 'Xem trước tài liệu.'}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-72 rounded-2xl border border-border bg-muted/40 p-4">
          {isImageDocument && document?.downloadUrl ? (
            <img
              src={document.downloadUrl}
              alt={document.name}
              className="max-h-[70vh] w-full rounded-xl object-contain"
            />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}