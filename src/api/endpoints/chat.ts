import { api } from '../client'
import type { Message } from '../types'

export const chatApi = {
  getMessages: async (documentId: string): Promise<Message[]> => {
    return api.get(`/documents/${documentId}/messages`)
  },
  sendMessage: async (
    documentId: string,
    payload: { content: string; exercise_id: string },
  ): Promise<Message> => {
    return api.post(`/documents/${documentId}/chat`, payload)
  },
}
