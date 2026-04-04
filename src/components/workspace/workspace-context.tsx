import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import type { Child, Document, Exercise } from '#/api/types'
import { useDocuments } from '#/hooks/api/useDocuments'
import { useExercises } from '#/hooks/api/useExercises'
import { useChildren } from '#/hooks/api/useProfile'

type WorkspaceContextType = {
  children: Child[]
  selectedChildId: string | null
  setSelectedChildId: (id: string | null) => void
  selectedChild: Child | null
  isChildrenLoading: boolean
  childrenError: string | null
  documents: Document[]
  isLoading: boolean
  error: string | null
  activeSourceId: string | null
  setActiveSourceId: (id: string | null) => void
  activeFocusId: string | null
  setActiveFocusId: (id: string | null) => void
  activeSource: Document | null
  activeExercise: Exercise | null
  isExercisePanelOpen: boolean
  setIsExercisePanelOpen: (open: boolean) => void
  isTourSampleDocumentActive: boolean
  ensureTourSampleDocument: () => void
  removeTourSampleDocument: () => void
}

const WorkspaceContext = createContext<WorkspaceContextType | null>(null)
const SELECTED_CHILD_STORAGE_KEY = 'edumate_selected_child_id'
const TOUR_DOCUMENT_ID = 'tour-sample-document'
const TOUR_EXERCISE_ID = 'tour-sample-exercise'

function mapExercise(exercise: Exercise): Exercise {
  return {
    id: exercise.id,
    title: exercise.title ?? 'Bài tập chưa đặt tên',
    detail: exercise.detail ?? exercise.html_content ?? '',
  }
}

function getDocumentItems(data: unknown): Document[] {
  if (Array.isArray(data)) {
    return data as Document[]
  }

  if (data && typeof data === 'object' && 'items' in data) {
    const items = (data as { items?: unknown }).items
    return Array.isArray(items) ? (items as Document[]) : []
  }

  return []
}

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const childrenQuery = useChildren()
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null)
  const documentsQuery = useDocuments({
    child_id: selectedChildId ?? undefined,
  })
  const [activeSourceId, setActiveSourceId] = useState<string | null>(null)
  const [activeFocusId, setActiveFocusId] = useState<string | null>(null)
  const [isExercisePanelOpen, setIsExercisePanelOpen] = useState(false)
  const [tourDocument, setTourDocument] = useState<Document | null>(null)
  const isTourSampleActive = activeSourceId === TOUR_DOCUMENT_ID
  const activeExercisesQuery = useExercises(
    isTourSampleActive ? '' : activeSourceId ?? '',
  )
  const childItems = useMemo(
    () =>
      (childrenQuery.data ?? []).map((child) => ({
        ...child,
        class: child.class ?? child.grade ?? null,
        grade: child.grade ?? child.class ?? null,
      })),
    [childrenQuery.data],
  )

  const documentItems = getDocumentItems(documentsQuery.data)

  const documents = useMemo(() => {
    if (!tourDocument) {
      return documentItems
    }

    const hasTourDocument = documentItems.some(
      (document) => document.id === TOUR_DOCUMENT_ID,
    )
    if (hasTourDocument) {
      return documentItems
    }

    return [tourDocument, ...documentItems]
  }, [documentItems, tourDocument])

  const ensureTourSampleDocument = useCallback(() => {
    const sampleDocument: Document = {
      id: TOUR_DOCUMENT_ID,
      title: 'Tài liệu mẫu: Toán lớp 1',
      kind: 'image',
      child_id: selectedChildId,
      exercises: [
        {
          id: TOUR_EXERCISE_ID,
          title: 'Bài mẫu: Phép cộng trong phạm vi 10',
          detail: 'Nam có 3 quả táo, mẹ cho thêm 2 quả. Hỏi Nam có tất cả bao nhiêu quả táo?',
          html_content:
            '<p>Nam có 3 quả táo, mẹ cho thêm 2 quả. Hỏi Nam có tất cả bao nhiêu quả táo?</p>',
        },
      ],
      exercise_count: 1,
    }

    setTourDocument((previous) => previous ?? sampleDocument)
    setActiveSourceId(TOUR_DOCUMENT_ID)
    setActiveFocusId(TOUR_EXERCISE_ID)
  }, [selectedChildId])

  const removeTourSampleDocument = useCallback(() => {
    setTourDocument(null)

    setActiveSourceId((previous) =>
      previous === TOUR_DOCUMENT_ID ? null : previous,
    )
    setActiveFocusId((previous) =>
      previous === TOUR_EXERCISE_ID ? null : previous,
    )
    setIsExercisePanelOpen(false)
  }, [])

  const selectedChild = useMemo(
    () => childItems.find((child) => child.id === selectedChildId) ?? null,
    [childItems, selectedChildId],
  )

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    if (childrenQuery.isLoading) {
      return
    }

    if (childItems.length === 0) {
      if (selectedChildId !== null) {
        setSelectedChildId(null)
      }
      window.localStorage.removeItem(SELECTED_CHILD_STORAGE_KEY)
      return
    }

    if (
      selectedChildId &&
      childItems.some((child) => child.id === selectedChildId)
    ) {
      return
    }

    const storedChildId = window.localStorage.getItem(
      SELECTED_CHILD_STORAGE_KEY,
    )
    const nextChildId =
      storedChildId && childItems.some((child) => child.id === storedChildId)
        ? storedChildId
        : childItems[0].id

    setSelectedChildId(nextChildId)
  }, [childItems, childrenQuery.isLoading, selectedChildId])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    if (!selectedChildId) {
      window.localStorage.removeItem(SELECTED_CHILD_STORAGE_KEY)
      return
    }

    window.localStorage.setItem(SELECTED_CHILD_STORAGE_KEY, selectedChildId)
  }, [selectedChildId])

  const activeSource = useMemo(() => {
    if (!activeSourceId) {
      return null
    }

    const source = documents.find(
      (candidate: Document) => candidate.id === activeSourceId,
    )
    if (!source) {
      return null
    }

    if (isTourSampleActive) {
      return source
    }

    return {
      ...source,
      exercises: activeExercisesQuery.data
        ? activeExercisesQuery.data.map(mapExercise)
        : source.exercises,
    }
  }, [documents, activeSourceId, activeExercisesQuery.data, isTourSampleActive])

  const activeExercise = useMemo(
    () =>
      activeSource?.exercises?.find(
        (exercise: Exercise) => exercise.id === activeFocusId,
      ) ?? null,
    [activeSource, activeFocusId],
  )

  useEffect(() => {
    if (!activeSourceId) {
      return
    }

    if (documentsQuery.isFetching) {
      return
    }

    const exists = documents.some(
      (source: Document) => source.id === activeSourceId,
    )
    if (!exists) {
      setActiveSourceId(null)
      setActiveFocusId(null)
    }
  }, [
    activeSourceId,
    documentsQuery.isFetching,
    setActiveFocusId,
    setActiveSourceId,
    documents,
  ])

  useEffect(() => {
    if (!activeSource) {
      return
    }

    if (activeSource.exercises?.length === 0) {
      if (activeFocusId !== null) {
        setActiveFocusId(null)
      }
      return
    }

    const selectedExerciseExists = activeSource.exercises?.some(
      (exercise: Exercise) => exercise.id === activeFocusId,
    )

    if (!selectedExerciseExists) {
      setActiveFocusId(activeSource.exercises?.[0].id as string)
    }
  }, [activeFocusId, activeSource, setActiveFocusId])

  const error =
    childrenQuery.error instanceof Error
      ? childrenQuery.error.message
      : documentsQuery.error instanceof Error
        ? documentsQuery.error.message
        : activeExercisesQuery.error instanceof Error
          ? activeExercisesQuery.error.message
          : null

  const isLoading =
    childrenQuery.isLoading ||
    documentsQuery.isLoading ||
    (!!activeSourceId && !isTourSampleActive && activeExercisesQuery.isLoading)

  const childrenError =
    childrenQuery.error instanceof Error ? childrenQuery.error.message : null

  return (
    <WorkspaceContext.Provider
      value={{
        children: childItems,
        selectedChildId,
        setSelectedChildId,
        selectedChild,
        isChildrenLoading: childrenQuery.isLoading,
        childrenError,
        documents,
        isLoading,
        error,
        activeSourceId,
        setActiveSourceId,
        activeFocusId,
        setActiveFocusId,
        activeSource,
        activeExercise,
        isExercisePanelOpen,
        setIsExercisePanelOpen,
        isTourSampleDocumentActive: isTourSampleActive,
        ensureTourSampleDocument,
        removeTourSampleDocument,
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
