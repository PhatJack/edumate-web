import { api } from '../client'
import type { User } from '../types'

export const authApi = {
  loginWithGoogle: async (): Promise<any> => {
    return api.post('/auth/google')
  },
  getMe: async (): Promise<User> => {
    return api.get('/auth/me')
  },
}
