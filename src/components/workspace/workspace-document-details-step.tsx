import { useEffect } from 'react'

import type { PixelCrop } from 'react-image-crop'

import { Button } from '#/components/ui/button'
import { WorkspaceImageCropper } from './workspace-image-cropper'
import type { DocumentKindOption } from './workspace-document-kind-step'

export function WorkspaceDocumentDetailsStep({
  selectedKind,
  selectedFile,
  previewUrl,
  textContent,
  onBackToKind,
  onFileChange,
  onTextContentChange,
  onCropComplete,
  imageRef,
}: {
  selectedKind: DocumentKindOption | null
  selectedFile: File | null
  previewUrl: string | null
  textContent: string
  onBackToKind: () => void
  onFileChange: (file: File | null) => void
  onTextContentChange: (value: string) => void
  onCropComplete: (crop: PixelCrop | null) => void
  imageRef: React.RefObject<HTMLImageElement | null>
}) {
  useEffect(() => {
    onFileChange(null)
  }, [selectedKind])

  return (
    <div className="grid gap-4">
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Loại đã chọn
            </p>
            <p className="text-sm font-semibold text-card-foreground">
              {selectedKind === 'image' ? 'Ảnh' : selectedKind === 'pdf' ? 'PDF' : 'Văn bản'}
            </p>
          </div>
          <Button type="button" variant="outline" onClick={onBackToKind}>
            Đổi loại
          </Button>
        </div>
      </div>

      {selectedKind === 'image' ? (
        <div className="grid gap-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold">Hãy chọn ảnh để tải lên</p>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
              className="block w-full cursor-pointer rounded-xl border border-dashed border-border bg-card px-4 py-3 text-sm text-muted-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-primary-foreground file:font-semibold hover:bg-accent"
            />
          </div>

          {selectedFile && previewUrl ? (
            <WorkspaceImageCropper
              file={selectedFile}
              previewUrl={previewUrl}
              imageRef={imageRef}
              onCropComplete={onCropComplete}
            />
          ) : null}
        </div>
      ) : null}

      {selectedKind === 'pdf' ? (
        <div className="grid gap-2">
          <p className="text-sm font-semibold">Hãy thêm file PDF</p>
          <p className="text-sm text-muted-foreground">Chọn file PDF trước khi tạo tài liệu.</p>
          <input
            type="file"
            accept="application/pdf,.pdf"
            onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
            className="block w-full cursor-pointer rounded-xl border border-dashed border-border bg-card px-4 py-3 text-sm text-muted-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-primary-foreground file:font-semibold hover:bg-accent"
          />
          {selectedFile ? (
            <div className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
              Đã chọn: {selectedFile.name}
            </div>
          ) : null}
        </div>
      ) : null}

      {selectedKind === 'text' ? (
        <div className="grid gap-2">
          <p className="text-sm font-semibold">Nhập nội dung văn bản</p>
          <textarea
            value={textContent}
            onChange={(event) => onTextContentChange(event.target.value)}
            placeholder="Nhập nội dung bài tập hoặc tài liệu..."
            rows={8}
            className="min-h-40 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring"
          />
        </div>
      ) : null}
    </div>
  )
}