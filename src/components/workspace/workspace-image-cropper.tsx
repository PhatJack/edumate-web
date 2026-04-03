import { useEffect, useState } from 'react'

import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

export function WorkspaceImageCropper({
  file,
  previewUrl,
  imageRef,
  onCropComplete,
  aspect = 1,
}: {
  file: File
  previewUrl: string
  imageRef: React.RefObject<HTMLImageElement | null>
  onCropComplete: (crop: PixelCrop | null) => void
  aspect?: number
}) {
  const [crop, setCrop] = useState<Crop>()

  useEffect(() => {
    onCropComplete(null)
  }, [file, onCropComplete])

  return (
    <div className="grid gap-2">
      <div className="flex justify-center">
        <div className="relative inline-block max-w-full overflow-hidden bg-muted/30">
          <ReactCrop
            crop={crop}
            onChange={(_, nextCrop) => setCrop(nextCrop)}
            onComplete={(pixelCrop) => {
              if (pixelCrop.width > 0 && pixelCrop.height > 0) {
                onCropComplete(pixelCrop)
              }
            }}
            keepSelection
            minWidth={64}
          >
            <img
              ref={imageRef}
              src={previewUrl}
              alt={file.name}
              onLoad={(event) => {
                const { width, height } = event.currentTarget
                const nextCrop =
                  aspect > 0
                    ? centerCrop(
                        makeAspectCrop(
                          { unit: '%', width: 70 },
                          aspect,
                          width,
                          height,
                        ),
                        width,
                        height,
                      )
                    : ({
                        unit: '%',
                        width: 70,
                        height: 70,
                        x: 15,
                        y: 15,
                      } as Crop)
                setCrop(nextCrop)
                onCropComplete({
                  x: Math.max(0, Math.round(((nextCrop.x ?? 0) / 100) * width)),
                  y: Math.max(
                    0,
                    Math.round(((nextCrop.y ?? 0) / 100) * height),
                  ),
                  width: Math.max(
                    1,
                    Math.round(((nextCrop.width ?? 0) / 100) * width),
                  ),
                  height: Math.max(
                    1,
                    Math.round(((nextCrop.height ?? 0) / 100) * height),
                  ),
                  unit: 'px',
                })
              }}
              className="block max-w-full select-none"
              draggable={false}
            />
          </ReactCrop>
        </div>
      </div>
    </div>
  )
}
