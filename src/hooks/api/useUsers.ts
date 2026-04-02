import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '../../api/endpoints/users'
import type { User } from '../../api/types'

export const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) =>
    [...usersKeys.lists(), { filters }] as const,
  details: () => [...usersKeys.all, 'detail'] as const,
  detail: (id: string) => [...usersKeys.details(), id] as const,
}

export function useUsers(params?: Record<string, any>) {
  return useQuery({
    queryKey: usersKeys.list(params || {}),
    queryFn: () => usersApi.getUsers(params),
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: () => usersApi.getUserById(id),
    enabled: !!id,
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<User> }) =>
      usersApi.updateUser(id, payload),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(usersKeys.detail(variables.id), data)
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
    },
  })
}
