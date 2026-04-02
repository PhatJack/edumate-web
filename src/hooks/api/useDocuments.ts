import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { documentsApi } from '../../api/endpoints/documents'

export const documentsKeys = {
  all: ['documents'] as const,
  lists: () => [...documentsKeys.all, 'list'] as const,
  list: (filters: { child_id?: string }) => [...documentsKeys.lists(), { filters }] as const,
  details: () => [...documentsKeys.all, 'detail'] as const,
  detail: (id: string) => [...documentsKeys.details(), id] as const,
}

export function useDocuments(params?: { child_id?: string }) {
  return useQuery({
    queryKey: documentsKeys.list(params || {}),
    queryFn: () => documentsApi.getDocuments(params),
  })
}

export function useDocument(id: string) {
  return useQuery({
    queryKey: documentsKeys.detail(id),
    queryFn: () => documentsApi.getDocumentById(id),
    enabled: !!id,
  })
}

export function useCreateDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: documentsApi.createDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentsKeys.lists() })
    },
  })
}

export function useImportDrive() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: documentsApi.importDrive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentsKeys.lists() })
    },
  })
}

export function useUpdateDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { title?: string; child_id?: string } }) =>
      documentsApi.updateDocument(id, payload),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(documentsKeys.detail(variables.id), data)
      queryClient.invalidateQueries({ queryKey: documentsKeys.lists() })
    },
  })
}

export function useDeleteDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: documentsApi.deleteDocument,
    onSuccess: (_, variables) => {
      queryClient.removeQueries({ queryKey: documentsKeys.detail(variables) })
      queryClient.invalidateQueries({ queryKey: documentsKeys.lists() })
    },
  })
}

export function useUploadDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      documentsApi.uploadDocument(id, file),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(documentsKeys.detail(variables.id), data)
    },
  })
}

export function useSubmitText() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      documentsApi.submitText(id, { content }),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(documentsKeys.detail(variables.id), data)
    },
  })
}

export function useScanPage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, page }: { id: string; page: number }) =>
      documentsApi.scanPage(id, { page }),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(documentsKeys.detail(variables.id), data)
    },
  })
}
