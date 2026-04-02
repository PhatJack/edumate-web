import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { profileApi } from '../../api/endpoints/profile'
import type { Child } from '../../api/types'

export const profileKeys = {
  all: ['profile'] as const,
  me: () => [...profileKeys.all, 'me'] as const,
  children: () => [...profileKeys.all, 'children'] as const,
}

export function useProfile() {
  return useQuery({
    queryKey: profileKeys.me(),
    queryFn: profileApi.getMe,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: profileApi.updateMe,
    onSuccess: (data) => {
      queryClient.setQueryData(profileKeys.me(), data)
    },
  })
}

export function useChildren() {
  return useQuery({
    queryKey: profileKeys.children(),
    queryFn: profileApi.getChildren,
  })
}

export function useAddChild() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: profileApi.addChild,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.children() })
    },
  })
}

export function useUpdateChild() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Child> }) =>
      profileApi.updateChild(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.children() })
    },
  })
}

export function useDeleteChild() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: profileApi.deleteChild,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.children() })
    },
  })
}
