import { useEffect, useState } from 'react'

import { Loader2 } from 'lucide-react'
import { getDownloadURL, getStorage, ref } from 'firebase/storage'

import type { Document } from '#/api/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { firebaseApp } from '#/firebase'

function getDocumentTitle(document: Document) {
  return document.title || 'Tài liệu chưa đặt tên'
}

export function DocumentPreviewDialog({
  document,
  open,
  onOpenChange,
}: {
  document: Document | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const isImageDocument = document?.kind === 'image'
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isResolvingImage, setIsResolvingImage] = useState(false)

  useEffect(() => {
    let isDisposed = false

    const resolveImageUrl = async () => {
      if (!open || !document || !isImageDocument) {
        setImageUrl(null)
        setIsResolvingImage(false)
        return
      }

      const fallbackUrl = document.download_url ?? null
      const objectPath = document.storage_object_path?.trim()

      if (!objectPath) {
        setImageUrl(fallbackUrl)
        setIsResolvingImage(false)
        return
      }

      setIsResolvingImage(true)

      try {
        const storage = getStorage(firebaseApp)
        const url = await getDownloadURL(ref(storage, objectPath))

        if (!isDisposed) {
          setImageUrl(url)
        }
      } catch {
        if (!isDisposed) {
          setImageUrl(fallbackUrl)
        }
      } finally {
        if (!isDisposed) {
          setIsResolvingImage(false)
        }
      }
    }

    void resolveImageUrl()

    return () => {
      isDisposed = true
    }
  }, [document, isImageDocument, open])

  return (
    <Dialog open={open && !!document} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {document ? getDocumentTitle(document) : 'Xem tài liệu'}
          </DialogTitle>
          <DialogDescription>
            {isImageDocument
              ? 'Bản xem trước tài liệu dạng ảnh.'
              : 'Xem trước tài liệu.'}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-72 rounded-2xl border border-border bg-muted/40 p-4">
          {isImageDocument && isResolvingImage && !imageUrl ? (
            <div className="flex min-h-72 items-center justify-center text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : null}

          {isImageDocument && imageUrl ? (
            <img
              src={imageUrl}
              alt={document.title}
              className="max-h-[70vh] w-full rounded-xl object-contain"
            />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
