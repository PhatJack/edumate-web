import { api } from '../client'
import type { Message } from '../types'

function normalizeMessagesPayload(payload: unknown): Message[] {
  if (Array.isArray(payload)) {
    return payload as Message[]
  }

  if (payload && typeof payload === 'object') {
    if ('items' in payload) {
      const items = (payload as { items?: unknown }).items
      return Array.isArray(items) ? (items as Message[]) : []
    }

    if ('messages' in payload) {
      const messages = (payload as { messages?: unknown }).messages
      return Array.isArray(messages) ? (messages as Message[]) : []
    }
  }

  return []
}

export const chatApi = {
  getMessages: async (documentId: string): Promise<Message[]> => {
    const payload = await api.get(`/documents/${documentId}/messages`)
    return normalizeMessagesPayload(payload)
  },
  sendMessage: async (
    documentId: string,
    payload: { message: string; exercise_id: string },
  ): Promise<Message> => {
    return api.post(`/documents/${documentId}/chat`, payload)
  },
}
