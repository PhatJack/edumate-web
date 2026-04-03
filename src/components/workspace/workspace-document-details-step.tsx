import { useEffect } from 'react'

import type { PixelCrop } from 'react-image-crop'

import { Button } from '#/components/ui/button'
import { WorkspaceImageCropper } from './workspace-image-cropper'
import type { DocumentKindOption } from './workspace-document-kind-step'

export function WorkspaceDocumentDetailsStep({
  selectedKind,
  selectedFile,
  previewUrl,
  scanPage,
  textContent,
  onBackToKind,
  onFileChange,
  onScanPageChange,
  onTextContentChange,
  onCropComplete,
  imageRef,
}: {
  selectedKind: DocumentKindOption | null
  selectedFile: File | null
  previewUrl: string | null
  scanPage: number
  textContent: string
  onBackToKind: () => void
  onFileChange: (file: File | null) => void
  onScanPageChange: (value: number) => void
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
              {selectedKind === 'image'
                ? 'Ảnh'
                : selectedKind === 'pdf'
                  ? 'PDF'
                  : 'Văn bản'}
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
              onChange={(event) =>
                onFileChange(event.target.files?.[0] ?? null)
              }
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
          <p className="text-sm text-muted-foreground">
            Chọn file PDF trước khi tạo tài liệu.
          </p>
          <input
            type="file"
            accept="application/pdf,.pdf"
            onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
            className="block w-full cursor-pointer rounded-xl border border-dashed border-border bg-card px-4 py-3 text-sm text-muted-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-primary-foreground file:font-semibold hover:bg-accent"
          />
          <div className="grid gap-1">
            <label
              htmlFor="scan-page"
              className="text-sm font-medium text-card-foreground"
            >
              Trang bạn muốn quét
            </label>
            <input
              id="scan-page"
              type="number"
              min={1}
              step={1}
              value={scanPage}
              onChange={(event) => {
                const parsedValue = Number.parseInt(event.target.value, 10)
                onScanPageChange(
                  Number.isNaN(parsedValue) ? 1 : Math.max(1, parsedValue),
                )
              }}
              className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground outline-none focus-visible:border-ring"
            />
          </div>
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
