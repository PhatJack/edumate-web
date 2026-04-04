import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Camera, ImagePlus, Loader2, Save, Trash2 } from 'lucide-react'
import type { PixelCrop } from 'react-image-crop'

import { useWorkspace } from './workspace-context'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { WorkspaceImageCropper } from './workspace-image-cropper'
import { cropImageFile } from './workspace-image-utils'
import { toast } from 'sonner'
import {
  useDeleteSampleSolution,
  useExerciseDetail,
  useUpdateSampleSolutionContent,
  useUploadSampleSolutionImage,
} from '#/hooks/api/useExercises'

export const ReferenceSolutionSection = memo(function ReferenceSolutionSection() {
  const { isTourSampleDocumentActive } = useWorkspace()

  if (isTourSampleDocumentActive) {
    return <TourSampleReferenceSolutionSection />
  }

  return <LiveReferenceSolutionSection />
})

function TourSampleReferenceSolutionSection() {
  const { activeExercise } = useWorkspace()

  if (!activeExercise) {
    return null
  }

  return (
    <section className="space-y-3 border-b border-border pb-6" id="reference-solution-section">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Bài giải tham khảo
      </p>
      <p className="text-sm text-muted-foreground">
        Cung cấp phương pháp của giáo viên trên lớp để trợ lý đưa ra hướng dẫn đồng nhất.
      </p>

      <div className="rounded-2xl border border-border bg-card p-3 shadow-sm">
        <div className="mb-3 rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
          Đây là phần giao diện mẫu. Khi dùng tài liệu thật, ba mẹ có thể thêm ảnh hoặc ghi chú lời giải của giáo viên.
        </div>

        <Textarea
          value={activeExercise.detail ?? activeExercise.html_content ?? ''}
          onChange={() => undefined}
          placeholder="Tóm tắt nội dung lời giải..."
          className="min-h-25 resize-none border-0 bg-transparent px-2 text-base leading-relaxed shadow-none focus-visible:ring-0"
          disabled
        />

        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-2">
            <Button type="button" size="icon" variant="outline" className="rounded-xl" disabled>
              <Camera />
            </Button>
            <Button type="button" size="icon" variant="outline" className="rounded-xl" disabled>
              <ImagePlus />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
              disabled
            >
              <Trash2 className="h-4 w-4" />
              Xóa
            </Button>
            <Button type="button" className="rounded-xl bg-slate-500 px-5 text-white hover:bg-slate-600" disabled>
              <Save className="h-4 w-4" />
              Lưu lại
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function LiveReferenceSolutionSection() {
  const { activeExercise, activeSourceId } = useWorkspace()
  const [content, setContent] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null)
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false)
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)

  const exerciseDetailQuery = useExerciseDetail(activeSourceId ?? '', activeExercise?.id ?? '')
  const updateContentMutation = useUpdateSampleSolutionContent()
  const uploadImageMutation = useUploadSampleSolutionImage()
  const deleteSampleSolutionMutation = useDeleteSampleSolution()

  const sampleSolution = exerciseDetailQuery.data?.sample_solution ?? null
  const sampleImageUrl = sampleSolution?.image?.url ?? null

  const isSavingText = updateContentMutation.isPending
  const isUploadingImage = uploadImageMutation.isPending
  const isDeleting = deleteSampleSolutionMutation.isPending
  const isBusy = isSavingText || isUploadingImage || isDeleting

  const hasExistingSolution = useMemo(() => {
    return Boolean(
      sampleSolution?.content ||
        sampleSolution?.detail ||
        sampleSolution?.html_content ||
        sampleImageUrl,
    )
  }, [sampleImageUrl, sampleSolution?.content, sampleSolution?.detail, sampleSolution?.html_content])

  useEffect(() => {
    const nextContent = sampleSolution?.content ?? sampleSolution?.detail ?? ''
    setContent(nextContent)
  }, [sampleSolution?.content, sampleSolution?.detail, activeExercise?.id])

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null)
      return
    }

    const nextPreviewUrl = URL.createObjectURL(selectedFile)
    setPreviewUrl(nextPreviewUrl)

    return () => {
      URL.revokeObjectURL(nextPreviewUrl)
    }
  }, [selectedFile])

  const openFilePicker = useCallback(() => {
    imageInputRef.current?.click()
  }, [])

  const handleCloseCropDialog = useCallback(() => {
    setIsCropDialogOpen(false)
    setSelectedFile(null)
    setCompletedCrop(null)
  }, [])

  const handleCropDialogOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        setIsCropDialogOpen(true)
        return
      }

      if (isUploadingImage) {
        return
      }

      handleCloseCropDialog()
    },
    [handleCloseCropDialog, isUploadingImage],
  )

  const handleFileSelection = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] ?? null
      if (!file) {
        return
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn một tệp ảnh hợp lệ.')
        return
      }

      setSelectedFile(file)
      setCompletedCrop(null)
      setIsCropDialogOpen(true)
      event.target.value = ''
    },
    [],
  )

  const handleSaveContent = useCallback(async () => {
    if (!activeSourceId || !activeExercise) {
      return
    }

    const text = content.trim()
    if (!text) {
      toast.error('Nội dung bài giải không được để trống.')
      return
    }

    try {
      await updateContentMutation.mutateAsync({
        documentId: activeSourceId,
        exerciseId: activeExercise.id,
        text,
      })
      toast.success('Đã lưu bài giải tham khảo.')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Không thể lưu bài giải tham khảo.',
      )
    }
  }, [activeExercise, activeSourceId, content, updateContentMutation])

  const handleConfirmCropUpload = useCallback(async () => {
    if (!activeSourceId || !activeExercise || !selectedFile) {
      return
    }

    if (!completedCrop || !imageRef.current) {
      toast.error('Vui lòng chọn vùng crop trước khi tải lên.')
      return
    }

    try {
      const croppedFile = await cropImageFile(selectedFile, completedCrop, imageRef.current)

      await uploadImageMutation.mutateAsync({
        documentId: activeSourceId,
        exerciseId: activeExercise.id,
        file: croppedFile,
      })

      toast.success('Đã tải ảnh bài giải tham khảo.')
      handleCloseCropDialog()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể tải ảnh lên.')
    }
  }, [
    activeExercise,
    activeSourceId,
    completedCrop,
    handleCloseCropDialog,
    selectedFile,
    uploadImageMutation,
  ])

  const handleDeleteSampleSolution = useCallback(async () => {
    if (!activeSourceId || !activeExercise) {
      return
    }

    try {
      await deleteSampleSolutionMutation.mutateAsync({
        documentId: activeSourceId,
        exerciseId: activeExercise.id,
      })
      setContent('')
      handleCloseCropDialog()
      toast.success('Đã xóa bài giải tham khảo.')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Không thể xóa bài giải tham khảo.',
      )
    }
  }, [
    activeExercise,
    activeSourceId,
    deleteSampleSolutionMutation,
    handleCloseCropDialog,
  ])

  if (!activeExercise) {
    return null
  }

  return (
    <section className="space-y-3 border-b border-border pb-6" id="reference-solution-section">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Bài giải tham khảo
      </p>
      <p className="text-sm text-muted-foreground">
        Cung cấp phương pháp của giáo viên trên lớp để trợ lý đưa ra hướng dẫn đồng nhất.
      </p>

      <div className="rounded-2xl border border-border bg-card p-3 shadow-sm">
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelection}
          className="hidden"
        />

        {(sampleImageUrl || previewUrl) && (
          <div className="mb-3 overflow-hidden rounded-xl border border-border bg-muted/20">
            <img
              src={previewUrl ?? sampleImageUrl ?? ''}
              alt="Bài giải tham khảo"
              className="max-h-44 w-full object-contain"
            />
          </div>
        )}

        <Textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Tóm tắt nội dung lời giải..."
          className="min-h-25 resize-none border-0 bg-transparent px-2 text-base leading-relaxed shadow-none focus-visible:ring-0"
          disabled={isBusy}
        />

        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="rounded-xl"
              onClick={openFilePicker}
              disabled={isBusy}
            >
              <Camera />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="rounded-xl"
              onClick={openFilePicker}
              disabled={isBusy}
            >
              <ImagePlus />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
              disabled={isBusy || !hasExistingSolution}
              onClick={handleDeleteSampleSolution}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Xóa
            </Button>
            <Button
              type="button"
              className="rounded-xl bg-slate-500 px-5 text-white hover:bg-slate-600"
              onClick={handleSaveContent}
              disabled={isBusy}
            >
              {isSavingText ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Lưu lại
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isCropDialogOpen} onOpenChange={handleCropDialogOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crop ảnh bài giải tham khảo</DialogTitle>
            <DialogDescription>
              Chọn vùng ảnh cần gửi lên. Ảnh mới sẽ ghi đè ảnh hiện tại.
            </DialogDescription>
          </DialogHeader>

          {selectedFile && previewUrl ? (
            <WorkspaceImageCropper
              file={selectedFile}
              previewUrl={previewUrl}
              imageRef={imageRef}
              onCropComplete={setCompletedCrop}
            />
          ) : null}

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleCloseCropDialog} disabled={isUploadingImage}>
              Hủy
            </Button>
            <Button type="button" onClick={handleConfirmCropUpload} disabled={isUploadingImage}>
              {isUploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
              Tải lên
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
