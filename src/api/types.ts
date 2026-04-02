import { z } from 'zod'

// --- Profile & User ---
export const ChildSchema = z.object({
  id: z.string(),
  name: z.string(),
  grade: z.string().optional().nullable(),
  learning_notes: z.string().optional().nullable(),
  created_at: z.string().optional(),
})
export type Child = z.infer<typeof ChildSchema>

export const ProfileSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  avatar_url: z.string().optional().nullable(),
  children: z.array(ChildSchema).optional(),
})
export type Profile = z.infer<typeof ProfileSchema>

export const UserSchema = z.object({
  uid: z.string(),
  email: z.string(),
  display_name: z.string().optional().nullable(),
  avatar_url: z.string().optional().nullable(),
  role: z.string().optional(),
})
export type User = z.infer<typeof UserSchema>


// --- Document & Exercise ---
export const ExerciseSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  html_content: z.string(),
  detail: z.string().optional().nullable(),
  agent_content: z.string().optional().nullable(),
  order: z.number().optional(),
})
export type Exercise = z.infer<typeof ExerciseSchema>

export const DocumentKindEnum = z.enum(['pdf', 'image', 'text', 'drive'])
export type DocumentKind = z.infer<typeof DocumentKindEnum>

export const DocumentSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  kind: DocumentKindEnum.optional(), // 'pdf', 'image', 'text', 'drive', etc.
  child_id: z.string().optional().nullable(),
  download_url: z.string().optional().nullable(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  exercises: z.array(ExerciseSchema).optional(), // Trả về kèm list bài tập (tuỳ endpoint)
})
export type Document = z.infer<typeof DocumentSchema>


// --- Chat Messages ---
export const MessageMetaSchema = z.object({
  exercise_ids: z.array(z.string()).optional(),
  // Add other meta fields if needed
}).catchall(z.any())

export const MessageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  message_type: z.string().default('text'), // 'text', 'welcome', etc.
  meta: MessageMetaSchema.optional().nullable(),
  created_at: z.string().optional(),
})
export type Message = z.infer<typeof MessageSchema>


// --- Common ---
export const PaginationSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  total: z.number().optional(),
  total_pages: z.number().optional(),
})
export type Pagination = z.infer<typeof PaginationSchema>

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    pagination: PaginationSchema,
  })
