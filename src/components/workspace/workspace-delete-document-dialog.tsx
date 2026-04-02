import { Loader2 } from 'lucide-react'

import type { Source } from './workspace-context'
import { useWorkspace } from './workspace-context'
import { useDeleteDocument } from '#/hooks/api/useDocuments'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'

function getDocumentTitle(document: Source) {
  return document.name || 'Tài liệu chưa đặt tên'
}

export function DeleteDocumentDialog({
  document,
  open,
  onOpenChange,
}: {
  document: Source | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const deleteDocument = useDeleteDocument()
  const { activeSourceId, setActiveSourceId, setActiveFocusId } = useWorkspace()

  const handleDelete = async () => {
    if (!document) {
      return
    }

    await deleteDocument.mutateAsync(document.id)

    if (activeSourceId === document.id) {
      setActiveSourceId(null)
      setActiveFocusId(null)
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open && !!document} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xóa tài liệu?</DialogTitle>
          <DialogDescription>
            {document
              ? `Tài liệu "${getDocumentTitle(document)}" sẽ bị xóa khỏi danh sách quản lý.`
              : 'Tài liệu này sẽ bị xóa khỏi danh sách quản lý.'}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteDocument.isPending}
          >
            Hủy
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteDocument.isPending}
          >
            {deleteDocument.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang xóa...
              </>
            ) : (
              'Xóa'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}