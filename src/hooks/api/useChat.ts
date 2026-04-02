import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { chatApi } from '../../api/endpoints/chat'

export const chatKeys = {
  all: ['chat'] as const,
  lists: () => [...chatKeys.all, 'messages'] as const,
  list: (documentId: string) => [...chatKeys.lists(), documentId] as const,
}

export function useMessages(documentId: string) {
  return useQuery({
    queryKey: chatKeys.list(documentId),
    queryFn: () => chatApi.getMessages(documentId),
    enabled: !!documentId,
  })
}

export function useSendMessage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      documentId,
      content,
      exercise_id,
    }: {
      documentId: string
      content: string
      exercise_id: string
    }) => chatApi.sendMessage(documentId, { content, exercise_id }),
    // Trong môi trường chat thường dùng optimistic update, 
    // tạm thời invalidate để fetch lại messages mới nhất
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: chatKeys.list(variables.documentId),
      })
    },
  })
}
