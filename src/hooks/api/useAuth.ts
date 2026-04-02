import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '../../api/endpoints/auth'
import { clearAppAccessToken } from '../../api/client'

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
    mutationFn: (idToken: string) => authApi.loginWithGoogle(idToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.me() })
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      clearAppAccessToken()
      queryClient.removeQueries({ queryKey: authKeys.me() })
    },
  })
}
