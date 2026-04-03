import { api } from '../client'
import type { Exercise, UploadAcceptedResponse } from '../types'

export const exercisesApi = {
  getExercises: async (documentId: string): Promise<Exercise[]> => {
    return api.get(`/documents/${documentId}/exercises`)
  },
  getExerciseDetail: async (
    documentId: string,
    exerciseId: string,
  ): Promise<Exercise> => {
    return api.get(`/documents/${documentId}/exercises/${exerciseId}`)
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
  ): Promise<UploadAcceptedResponse> => {
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
  updateSampleSolutionContent: async (
    documentId: string,
    exerciseId: string,
    text: string,
  ): Promise<Exercise> => {
    return api.post(
      `/documents/${documentId}/exercises/${exerciseId}/sample-solution-content`,
      { text },
    )
  },
  createSimilar: async (documentId: string, exerciseId: string, hint: string): Promise<Exercise> => {
    return api.post(`/documents/${documentId}/exercises/${exerciseId}/similar`, {
      hint,
    })
  },
  deleteSampleSolution: async (
    documentId: string,
    exerciseId: string,
  ): Promise<Exercise> => {
    return api.delete(
      `/documents/${documentId}/exercises/${exerciseId}/sample-solution`,
    )
  },
}
