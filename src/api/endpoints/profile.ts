import { api } from '../client'
import type { Profile, Child } from '../types'

export const profileApi = {
  getMe: async (): Promise<Profile> => {
    return api.get('/profile/me')
  },
  updateMe: async (payload: Partial<Profile>): Promise<Profile> => {
    return api.patch('/profile/me', payload)
  },
  getChildren: async (): Promise<Child[]> => {
    return api.get('/profile/me/children')
  },
  addChild: async (
    payload: Omit<Child, 'id' | 'created_at'>,
  ): Promise<Child> => {
    return api.post('/profile/me/children', payload)
  },
  updateChild: async (id: string, payload: Partial<Child>): Promise<Child> => {
    return api.patch(`/profile/me/children/${id}`, payload)
  },
  deleteChild: async (id: string): Promise<void> => {
    return api.delete(`/profile/me/children/${id}`)
  },
}
