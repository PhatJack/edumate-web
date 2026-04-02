import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import type { Document as ApiDocument, Exercise as ApiExercise } from '#/api/types'
import { useDocuments } from '#/hooks/api/useDocuments'
import { useExercises } from '#/hooks/api/useExercises'

export type Exercise = {
  id: string
  title: string
  detail: string
}

export type Source = {
  id: string
  name: string
  kind: ApiDocument['kind']
  downloadUrl: string | null
  exercises: Exercise[]
}

type WorkspaceContextType = {
  sources: Source[]
  isLoading: boolean
  error: string | null
  activeSourceId: string | null
  setActiveSourceId: (id: string | null) => void
  activeFocusId: string | null
  setActiveFocusId: (id: string | null) => void
  activeSource: Source | null
  activeExercise: Exercise | null
}

const WorkspaceContext = createContext<WorkspaceContextType | null>(null)

function mapExercise(exercise: ApiExercise): Exercise {
  return {
    id: exercise.id,
    title: exercise.title ?? 'Bài tập chưa đặt tên',
    detail: exercise.detail ?? exercise.html_content ?? '',
  }
}

function getDocumentItems(data: unknown): ApiDocument[] {
  if (Array.isArray(data)) {
    return data as ApiDocument[]
  }

  if (data && typeof data === 'object' && 'items' in data) {
    const items = (data as { items?: unknown }).items
    return Array.isArray(items) ? (items as ApiDocument[]) : []
  }

  return []
}

function mapDocument(document: ApiDocument): Source {
  return {
    id: document.id,
    name: document.title ?? 'Tài liệu chưa đặt tên',
    kind: document.kind ?? 'text',
    downloadUrl: document.download_url ?? null,
    exercises: (document.exercises ?? []).map(mapExercise),
  }
}

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const documentsQuery = useDocuments()
  const [activeSourceId, setActiveSourceId] = useState<string | null>(null)
  const [activeFocusId, setActiveFocusId] = useState<string | null>(null)
  const activeExercisesQuery = useExercises(activeSourceId ?? '')

  const documentItems = getDocumentItems(documentsQuery.data)

  const sources = useMemo(
    () => documentItems.map(mapDocument),
    [documentItems],
  )

  const activeSource = useMemo(
    () => {
      if (!activeSourceId) {
        return null
      }

      const source = sources.find((candidate: Source) => candidate.id === activeSourceId)
      if (!source) {
        return null
      }

      return {
        ...source,
        exercises: activeExercisesQuery.data
          ? activeExercisesQuery.data.map(mapExercise)
          : source.exercises,
      }
    },
    [sources, activeSourceId, activeExercisesQuery.data],
  )

  const activeExercise = useMemo(
    () =>
      activeSource?.exercises.find((exercise: Exercise) => exercise.id === activeFocusId) ??
      null,
    [activeSource, activeFocusId],
  )

  useEffect(() => {
    if (!activeSourceId) {
      return
    }

    if (documentsQuery.isFetching) {
      return
    }

    const exists = sources.some((source: Source) => source.id === activeSourceId)
    if (!exists) {
      setActiveSourceId(null)
      setActiveFocusId(null)
    }
  }, [activeSourceId, documentsQuery.isFetching, setActiveFocusId, setActiveSourceId, sources])

  useEffect(() => {
    if (!activeSource) {
      return
    }

    if (activeSource.exercises.length === 0) {
      if (activeFocusId !== null) {
        setActiveFocusId(null)
      }
      return
    }

    const selectedExerciseExists = activeSource.exercises.some(
      (exercise: Exercise) => exercise.id === activeFocusId,
    )

    if (!selectedExerciseExists) {
      setActiveFocusId(activeSource.exercises[0].id)
    }
  }, [activeFocusId, activeSource, setActiveFocusId])

  const error =
    documentsQuery.error instanceof Error
      ? documentsQuery.error.message
      : activeExercisesQuery.error instanceof Error
        ? activeExercisesQuery.error.message
        : null

  const isLoading =
    documentsQuery.isLoading ||
    (!!activeSourceId && activeExercisesQuery.isLoading)

  return (
    <WorkspaceContext.Provider
      value={{
        sources,
        isLoading,
        error,
        activeSourceId,
        setActiveSourceId,
        activeFocusId,
        setActiveFocusId,
        activeSource,
        activeExercise,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider')
  }
  return context
}
