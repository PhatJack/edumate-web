import axios from 'axios'

const APP_ACCESS_TOKEN_KEY = 'edumate_access_token'

export function getAppAccessToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  return window.localStorage.getItem(APP_ACCESS_TOKEN_KEY)
}

export function setAppAccessToken(token: string): void {
  if (typeof window === 'undefined') {
    return
  }
  window.localStorage.setItem(APP_ACCESS_TOKEN_KEY, token)
}

export function clearAppAccessToken(): void {
  if (typeof window === 'undefined') {
    return
  }
  window.localStorage.removeItem(APP_ACCESS_TOKEN_KEY)
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor: Đính kèm app access token
api.interceptors.request.use(
  async (config) => {
    const token = getAppAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response Interceptor: Unwrap envelope JSON nếu có
api.interceptors.response.use(
  (response) => {
    // Pattern: { "success": true, "data": ... }
    if (
      response.data &&
      typeof response.data === 'object' &&
      'success' in response.data
    ) {
      if (response.data.success) {
        // Axios trả về `data` ở layer request của nó
        return response.data.data
      } else {
        // Backend trả về success: false kèm theo error (có thể HTTP 200 tuỳ config)
        return Promise.reject(new Error(response.data.error || 'Server error'))
      }
    }
    // Nếu ko có cấu trúc envelope (ví dụ gọi external API) thì trả về nguyên bản
    return response.data
  },
  (error) => {
    // Xử lý lỗi HTTP status !== 2xx
    if (
      error.response?.data &&
      typeof error.response.data === 'object' &&
      'success' in error.response.data
    ) {
      if (!error.response.data.success && error.response.data.error) {
        return Promise.reject(
          error.response.data.error.detail ||
            error.response.data.error ||
            'Server error',
        )
      }
    }
    return Promise.reject(error)
  },
)
