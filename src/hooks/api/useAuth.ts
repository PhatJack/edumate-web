import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '../../api/endpoints/auth'

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
}

export function useMe() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: authApi.getMe,
  })
}

export function useLoginWithGoogle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authApi.loginWithGoogle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.me() })
    },
  })
}
