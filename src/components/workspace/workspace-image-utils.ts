import type { PixelCrop } from 'react-image-crop'

function fileNameWithoutExtension(name: string) {
  return name.replace(/\.[^.]+$/, '')
}

export async function cropImageFile(
  file: File,
  cropRect: PixelCrop,
  imageElement: HTMLImageElement,
) {
  const scaleX = imageElement.naturalWidth / imageElement.width
  const scaleY = imageElement.naturalHeight / imageElement.height

  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(cropRect.width * scaleX))
  canvas.height = Math.max(1, Math.round(cropRect.height * scaleY))

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Không thể khởi tạo canvas để crop ảnh.')
  }

  context.drawImage(
    imageElement,
    cropRect.x * scaleX,
    cropRect.y * scaleY,
    cropRect.width * scaleX,
    cropRect.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height,
  )

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => {
      if (!result) {
        reject(new Error('Không thể crop ảnh.'))
        return
      }

      resolve(result)
    }, 'image/png')
  })

  return new File([blob], `${fileNameWithoutExtension(file.name)}-cropped.png`, {
    type: 'image/png',
  })
}