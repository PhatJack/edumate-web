import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { exercisesApi } from '../../api/endpoints/exercises'
import type { Exercise } from '../../api/types'

export const exercisesKeys = {
  all: ['exercises'] as const,
  lists: () => [...exercisesKeys.all, 'list'] as const,
  list: (documentId: string) => [...exercisesKeys.lists(), documentId] as const,
  details: () => [...exercisesKeys.all, 'detail'] as const,
  detail: (documentId: string, exerciseId: string) =>
    [...exercisesKeys.details(), documentId, exerciseId] as const,
}

export function useExercises(documentId: string) {
  return useQuery({
    queryKey: exercisesKeys.list(documentId),
    queryFn: () => exercisesApi.getExercises(documentId),
    enabled: !!documentId,
  })
}

export function useExerciseDetail(documentId: string, exerciseId: string) {
  return useQuery({
    queryKey: exercisesKeys.detail(documentId, exerciseId),
    queryFn: () => exercisesApi.getExerciseDetail(documentId, exerciseId),
    enabled: !!documentId && !!exerciseId,
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
      queryClient.invalidateQueries({
        queryKey: exercisesKeys.detail(variables.documentId, variables.exerciseId),
      })
    },
  })
}

export function useUploadSampleSolutionImage() {
  const queryClient = useQueryClient()
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: exercisesKeys.list(variables.documentId),
      })
      queryClient.invalidateQueries({
        queryKey: exercisesKeys.detail(variables.documentId, variables.exerciseId),
      })
    },
  })
}

export function useUpdateSampleSolutionContent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      documentId,
      exerciseId,
      text,
    }: {
      documentId: string
      exerciseId: string
      text: string
    }) =>
      exercisesApi.updateSampleSolutionContent(documentId, exerciseId, text),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: exercisesKeys.list(variables.documentId),
      })
      queryClient.invalidateQueries({
        queryKey: exercisesKeys.detail(variables.documentId, variables.exerciseId),
      })
    },
  })
}

export function useCreateSimilarExercise() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      documentId,
      exerciseId,
      hint,
    }: {
      documentId: string
      exerciseId: string
      hint: string
    }) => exercisesApi.createSimilar(documentId, exerciseId, hint),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: exercisesKeys.list(variables.documentId),
      })
      queryClient.invalidateQueries({
        queryKey: exercisesKeys.detail(variables.documentId, variables.exerciseId),
      })
    },
  })
}

export function useDeleteSampleSolution() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      documentId,
      exerciseId,
    }: {
      documentId: string
      exerciseId: string
    }) => exercisesApi.deleteSampleSolution(documentId, exerciseId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: exercisesKeys.list(variables.documentId),
      })
      queryClient.invalidateQueries({
        queryKey: exercisesKeys.detail(variables.documentId, variables.exerciseId),
      })
    },
  })
}
