import { api } from '../client'
import type { Document, Exercise } from '../types'

export const documentsApi = {
  getDocuments: async (params?: { child_id?: string }): Promise<Document[]> => {
    return api.get('/documents', { params })
  },
  createDocument: async (payload: {
    kind: string
    child_id?: string
  }): Promise<Document> => {
    return api.post('/documents', payload)
  },
  importDrive: async (payload: {
    file_id: string
    access_token: string
  }): Promise<Document> => {
    return api.post('/documents/import-drive', payload)
  },
  getDocumentById: async (id: string): Promise<Document> => {
    return api.get(`/documents/${id}`)
  },
  updateDocument: async (
    id: string,
    payload: { title?: string; child_id?: string },
  ): Promise<Document> => {
    return api.patch(`/documents/${id}`, payload)
  },
  deleteDocument: async (id: string): Promise<void> => {
    return api.delete(`/documents/${id}`)
  },
  uploadDocument: async (id: string, file: File): Promise<Document> => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post(`/documents/${id}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  submitText: async (
    id: string,
    payload: { content: string },
  ): Promise<Document> => {
    return api.post(`/documents/${id}/submit-text`, payload)
  },
  scanPage: async (
    id: string,
    payload: { page: number },
  ): Promise<Document> => {
    return api.post(`/documents/${id}/scan-page`, payload)
  },
}
