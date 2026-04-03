import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Loader2 } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import type { PixelCrop } from 'react-image-crop'

import { useWorkspace } from './workspace-context'
import type { DocumentKindOption } from './workspace-document-kind-step'
import { WorkspaceDocumentKindStep } from './workspace-document-kind-step'
import { WorkspaceDocumentDetailsStep } from './workspace-document-details-step'
import {
  documentsKeys,
  useCreateDocument,
  useScanPage,
  useSubmitText,
  useUploadDocument,
} from '#/hooks/api/useDocuments'
import { cropImageFile } from './workspace-image-utils'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { toast } from 'sonner'
import { ScrollArea } from '../ui/scroll-area'

type AddStep = 'kind' | 'details'

export function AddDocumentDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [step, setStep] = useState<AddStep>('kind')
  const [selectedKind, setSelectedKind] = useState<DocumentKindOption | null>(
    null,
  )
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [scanPage, setScanPage] = useState(1)
  const [textContent, setTextContent] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null)
  const createDocument = useCreateDocument()
  const uploadDocument = useUploadDocument()
  const scanDocumentPage = useScanPage()
  const submitText = useSubmitText()
  const queryClient = useQueryClient()
  const { selectedChildId, setActiveSourceId, setActiveFocusId, isLoading } =
    useWorkspace()
  const imageRef = useRef<HTMLImageElement | null>(null)

  const isBusy =
    createDocument.isPending ||
    uploadDocument.isPending ||
    scanDocumentPage.isPending ||
    submitText.isPending

  const dialogDescription = useMemo(
    () =>
      step === 'kind'
        ? 'Bước 1: Chọn loại tài liệu.'
        : 'Bước 2: Nhập đúng nội dung cho loại tài liệu đã chọn.',
    [step],
  )

  const resetDialog = useCallback(() => {
    setStep('kind')
    setSelectedKind('image')
    setSelectedFile(null)
    setScanPage(1)
    setTextContent('')
    setPreviewUrl(null)
    setCompletedCrop(null)
  }, [])

  const handleClose = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        resetDialog()
      }

      onOpenChange(nextOpen)
    },
    [onOpenChange, resetDialog],
  )

  const handleSelectKind = useCallback((kind: DocumentKindOption | null) => {
    setSelectedKind(kind)
    setSelectedFile(null)
    setScanPage(1)
    setTextContent('')
    setPreviewUrl(null)
    setCompletedCrop(null)
    setStep('details')
  }, [])

  const handleBackToKind = useCallback(() => {
    setStep('kind')
  }, [])

  const handleFileChange = useCallback((file: File | null) => {
    setSelectedFile(file)
    setCompletedCrop(null)
  }, [])

  const handleTextContentChange = useCallback((value: string) => {
    setTextContent(value)
  }, [])

  const handleScanPageChange = useCallback((value: number) => {
    setScanPage(value)
  }, [])

  const handleCropComplete = useCallback((crop: PixelCrop | null) => {
    setCompletedCrop(crop)
  }, [])

  useEffect(() => {
    if (!selectedFile || selectedKind !== 'image') {
      setPreviewUrl(null)
      return
    }

    const nextPreviewUrl = URL.createObjectURL(selectedFile)
    setPreviewUrl(nextPreviewUrl)

    return () => {
      URL.revokeObjectURL(nextPreviewUrl)
    }
  }, [selectedFile, selectedKind])

  useEffect(() => {
    if (!open) {
      resetDialog()
    }
  }, [open, resetDialog])

  const handleCreate = useCallback(async () => {
    try {
      if (!selectedChildId) {
        toast.error('Vui lòng chọn hoặc tạo học sinh trước khi tạo tài liệu.')
        return
      }

      if (selectedKind === 'text') {
        const trimmedContent = textContent.trim()
        if (!trimmedContent) {
          toast.error('Vui lòng nhập nội dung văn bản trước khi tạo tài liệu.')
          return
        }

        const createdDocument = await createDocument.mutateAsync({
          kind: selectedKind,
          child_id: selectedChildId,
        })
        await submitText.mutateAsync({
          id: createdDocument.id,
          content: trimmedContent,
        })
        await queryClient.invalidateQueries({ queryKey: documentsKeys.lists() })

        setActiveSourceId(createdDocument.id)
        setActiveFocusId(null)
        handleClose(false)
        return
      }

      if (!selectedFile) {
        toast.error(
          selectedKind === 'image'
            ? 'Vui lòng chọn một ảnh trước khi tải lên.'
            : 'Vui lòng chọn file PDF trước khi tải lên.',
        )
        return
      }

      if (!selectedKind) {
        toast.error(
          'Loại tài liệu không hợp lệ. Vui lòng chọn lại loại tài liệu.',
        )
        return
      }

      const createdDocument = await createDocument.mutateAsync({
        kind: selectedKind,
        child_id: selectedChildId,
      })

      if (selectedKind === 'image') {
        const imageElement = imageRef.current
        if (!imageElement || !completedCrop) {
          toast.error('Vui lòng crop ảnh trước khi gửi.')
          return
        }

        const croppedFile = await cropImageFile(
          selectedFile,
          completedCrop,
          imageElement,
        )
        await uploadDocument.mutateAsync({
          id: createdDocument.id,
          file: croppedFile,
        })
      } else {
        await uploadDocument.mutateAsync({
          id: createdDocument.id,
          file: selectedFile,
        })

        const normalizedPage = Number.isFinite(scanPage)
          ? Math.max(1, Math.floor(scanPage))
          : 1

        await scanDocumentPage.mutateAsync({
          id: createdDocument.id,
          page: normalizedPage,
        })
      }

      await queryClient.invalidateQueries({ queryKey: documentsKeys.lists() })

      setActiveSourceId(createdDocument.id)
      setActiveFocusId(null)
      handleClose(false)
    } catch (submitError) {
      toast.error(
        submitError instanceof Error
          ? submitError.message
          : 'Không thể tạo tài liệu ngay lúc này.',
      )
    }
  }, [
    completedCrop,
    createDocument,
    handleClose,
    imageRef,
    queryClient,
    selectedFile,
    selectedKind,
    selectedChildId,
    scanDocumentPage,
    scanPage,
    setActiveFocusId,
    setActiveSourceId,
    submitText,
    textContent,
    uploadDocument,
  ])

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        onInteractOutside={(event) => {
          if (isLoading || isBusy) {
            event.preventDefault()
          }
        }}
        onEscapeKeyDown={(event) => {
          if (isLoading || isBusy) {
            event.preventDefault()
          }
        }}
        className="max-h-[90vh] grid-rows-[auto_minmax(0,1fr)_auto] sm:max-w-3xl"
      >
        <DialogHeader>
          <DialogTitle>Thêm tài liệu học</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="min-h-0 h-full pr-3">
          {step === 'kind' ? (
            <WorkspaceDocumentKindStep
              selectedKind={selectedKind}
              onSelectKind={handleSelectKind}
            />
          ) : (
            <WorkspaceDocumentDetailsStep
              selectedKind={selectedKind}
              selectedFile={selectedFile}
              previewUrl={previewUrl}
              scanPage={scanPage}
              textContent={textContent}
              imageRef={imageRef}
              onBackToKind={handleBackToKind}
              onFileChange={handleFileChange}
              onScanPageChange={handleScanPageChange}
              onTextContentChange={handleTextContentChange}
              onCropComplete={handleCropComplete}
            />
          )}
        </ScrollArea>

        <DialogFooter>
          <div className="flex w-full items-center justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={
                step === 'details'
                  ? () => {
                      setStep('kind')
                    }
                  : () => handleClose(false)
              }
              disabled={isBusy}
            >
              {step === 'details' ? 'Quay lại' : 'Hủy'}
            </Button>

            {step === 'details' ? (
              <Button type="button" onClick={handleCreate} disabled={isBusy}>
                {isBusy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : selectedKind === 'text' ? (
                  'Tạo từ nội dung'
                ) : (
                  'Tải lên và tạo'
                )}
              </Button>
            ) : null}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
