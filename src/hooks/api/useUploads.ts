import { useMutation } from '@tanstack/react-query'
import { uploadsApi } from '../../api/endpoints/uploads'

export function useUploadFile() {
  return useMutation({
    mutationFn: (file: File) => uploadsApi.uploadFile(file),
  })
}
