import axios from 'axios'
import { auth } from '@/firebase'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor: Đính kèm Firebase ID Token
api.interceptors.request.use(
  async (config) => {
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken()
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
        return Promise.reject(
          new Error(
            response.data.error?.message ||
              response.data.error ||
              'Server error',
          ),
        )
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
          new Error(
            error.response.data.error.message ||
              error.response.data.error ||
              'Server error',
          ),
        )
      }
    }
    return Promise.reject(error)
  },
)
