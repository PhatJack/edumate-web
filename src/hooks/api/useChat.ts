import { useMutation, useMutationState, useQuery, useQueryClient } from '@tanstack/react-query'

import { chatApi } from '../../api/endpoints/chat'
import type { Message } from '../../api/types'

export const chatKeys = {
  all: ['chat'] as const,
  lists: () => [...chatKeys.all, 'messages'] as const,
  list: (documentId: string) => [...chatKeys.lists(), documentId] as const,
  send: () => [...chatKeys.all, 'send-message'] as const,
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
    mutationKey: chatKeys.send(),
    mutationFn: ({
      documentId,
      message,
      exercise_id,
    }: {
      documentId: string
      message: string
      exercise_id: string
    }) => chatApi.sendMessage(documentId, { message, exercise_id }),
    onMutate: async (variables) => {
      const queryKey = chatKeys.list(variables.documentId)

      await queryClient.cancelQueries({ queryKey })

      const previousMessages = queryClient.getQueryData<Message[]>(queryKey) ?? []

      const optimisticMessage: Message = {
        id: `optimistic-${Date.now()}`,
        role: 'user',
        content: variables.message,
        message_type: 'text',
        created_at: new Date().toISOString(),
      }

      queryClient.setQueryData<Message[]>(queryKey, [...previousMessages, optimisticMessage])

      return { previousMessages, documentId: variables.documentId }
    },
    onError: (_error, _variables, context) => {
      if (!context) {
        return
      }

      queryClient.setQueryData(chatKeys.list(context.documentId), context.previousMessages)
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: chatKeys.list(variables.documentId),
      })
    },
  })
}

export function useIsSendingMessage(documentId: string | null) {
  const pendingMutations = useMutationState<{ documentId: string }>({
    filters: { mutationKey: chatKeys.send(), status: 'pending' },
    select: (mutation) => mutation.state.variables,
  })

  if (!documentId) {
    return false
  }

  return pendingMutations.some(
    (variables) => variables?.documentId === documentId,
  )
}
