import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { exercisesApi } from '../../api/endpoints/exercises'
import type { Exercise } from '../../api/types'

export const exercisesKeys = {
  all: ['exercises'] as const,
  lists: () => [...exercisesKeys.all, 'list'] as const,
  list: (documentId: string) => [...exercisesKeys.lists(), documentId] as const,
}

export function useExercises(documentId: string) {
  return useQuery({
    queryKey: exercisesKeys.list(documentId),
    queryFn: () => exercisesApi.getExercises(documentId),
    enabled: !!documentId,
  })
}

export function useUpdateExercise() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      documentId,
      exerciseId,
      payload,
    }: {
      documentId: string
      exerciseId: string
      payload: Partial<Exercise>
    }) => exercisesApi.updateExercise(documentId, exerciseId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: exercisesKeys.list(variables.documentId),
      })
    },
  })
}

export function useUploadSampleSolutionImage() {
  return useMutation({
    mutationFn: ({
      documentId,
      exerciseId,
      file,
    }: {
      documentId: string
      exerciseId: string
      file: File
    }) => exercisesApi.uploadSampleSolutionImage(documentId, exerciseId, file),
  })
}

export function useCreateSimilarExercise() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      documentId,
      exerciseId,
    }: {
      documentId: string
      exerciseId: string
    }) => exercisesApi.createSimilar(documentId, exerciseId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: exercisesKeys.list(variables.documentId),
      })
    },
  })
}
