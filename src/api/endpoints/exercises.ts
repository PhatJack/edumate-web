import { api } from '../client'
import type { Exercise } from '../types'

export const exercisesApi = {
  getExercises: async (documentId: string): Promise<Exercise[]> => {
    return api.get(`/documents/${documentId}/exercises`)
  },
  updateExercise: async (
    documentId: string,
    exerciseId: string,
    payload: Partial<Exercise>,
  ): Promise<Exercise> => {
    return api.patch(
      `/documents/${documentId}/exercises/${exerciseId}`,
      payload,
    )
  },
  uploadSampleSolutionImage: async (
    documentId: string,
    exerciseId: string,
    file: File,
  ): Promise<any> => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post(
      `/documents/${documentId}/exercises/${exerciseId}/sample-solution-image`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    )
  },
  createSimilar: async (
    documentId: string,
    exerciseId: string,
  ): Promise<Exercise> => {
    return api.post(`/documents/${documentId}/exercises/${exerciseId}/similar`)
  },
}
