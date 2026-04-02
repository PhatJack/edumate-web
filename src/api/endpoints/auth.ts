import { api, clearAppAccessToken, setAppAccessToken } from '../client'
import type { User } from '../types'

type LoginResponse = {
  access_token: string
  token_type: string
}

export const authApi = {
  loginWithGoogle: async (idToken: string): Promise<LoginResponse> => {
    const payload = await api.post<LoginResponse, LoginResponse>(
      '/auth/google',
      { id_token: idToken },
    )
    setAppAccessToken(payload.access_token)
    return payload
  },
  logout: async (): Promise<any> => {
    const result = await api.post('/auth/logout')
    clearAppAccessToken()
    return result
  },
  getMe: async (): Promise<User> => {
    return api.get<User, User>('/auth/me')
  },
}
