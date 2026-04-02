import { api } from '../client'
import type {
  Child,
  ChildCreatePayload,
  ChildList,
  ChildUpdatePayload,
  Profile,
} from '../types'

function normalizeChild(rawChild: Child): Child {
  return {
    ...rawChild,
    class: rawChild.class ?? rawChild.grade ?? null,
    grade: rawChild.grade ?? rawChild.class ?? null,
  }
}

function getChildrenFromResponse(response: unknown): Child[] {
  if (Array.isArray(response)) {
    return response.map((child) => normalizeChild(child as Child))
  }

  if (response && typeof response === 'object' && 'items' in response) {
    const childList = response as ChildList
    return (childList.items ?? []).map(normalizeChild)
  }

  return []
}

export const profileApi = {
  getMe: async (): Promise<Profile> => {
    return api.get('/profile/me')
  },
  updateMe: async (payload: Partial<Profile>): Promise<Profile> => {
    return api.patch('/profile/me', payload)
  },
  getChildren: async (): Promise<Child[]> => {
    const response = await api.get<Child[] | ChildList, Child[] | ChildList>(
      '/profile/me/children',
    )
    return getChildrenFromResponse(response)
  },
  addChild: async (payload: ChildCreatePayload): Promise<Child> => {
    const response = await api.post<Child, Child, ChildCreatePayload>(
      '/profile/me/children',
      payload,
    )
    return normalizeChild(response)
  },
  updateChild: async (id: string, payload: ChildUpdatePayload): Promise<Child> => {
    const response = await api.patch<Child, Child, ChildUpdatePayload>(
      `/profile/me/children/${id}`,
      payload,
    )
    return normalizeChild(response)
  },
  deleteChild: async (id: string): Promise<void> => {
    return api.delete(`/profile/me/children/${id}`)
  },
}
