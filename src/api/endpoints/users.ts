import { api } from '../client'
import type { User } from '../types'

export const usersApi = {
  getUsers: async (params?: Record<string, any>): Promise<any> => {
    return api.get('/users', { params })
  },
  getUserById: async (id: string): Promise<User> => {
    return api.get(`/users/${id}`)
  },
  updateUser: async (id: string, payload: Partial<User>): Promise<User> => {
    return api.patch(`/users/${id}`, payload)
  },
}
