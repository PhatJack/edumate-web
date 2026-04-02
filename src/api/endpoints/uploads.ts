import { api } from '../client'

export const uploadsApi = {
  uploadFile: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}
