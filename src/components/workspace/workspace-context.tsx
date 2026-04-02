import { createContext, useContext, useMemo, useState } from 'react'

export type Exercise = {
  id: string
  title: string
  detail: string
}

export type Source = {
  id: string
  name: string
  type: 'pdf' | 'image' | 'text'
  exercises: Exercise[]
}

type WorkspaceContextType = {
  sources: Source[]
  activeSourceId: string
  setActiveSourceId: (id: string) => void
  activeFocusId: string
  setActiveFocusId: (id: string) => void
  activeSource: Source | null
  activeExercise: Exercise | null
}

const WorkspaceContext = createContext<WorkspaceContextType | null>(null)

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [sources] = useState<Source[]>([
    {
      id: 'src-1',
      name: 'Phiếu bài tập Tiếng Việt',
      type: 'image',
      exercises: [
        {
          id: 'ex-1',
          title: 'Bài 1: Xác định từ láy',
          detail:
            'Gạch chân các từ láy trong đoạn văn và giải thích vì sao em chọn từ đó.',
        },
        {
          id: 'ex-2',
          title: 'Bài 2: Đặt câu',
          detail: 'Dùng một từ láy trong bài 1 để đặt câu tả cảnh.',
        },
      ],
    },
  ])

  const [activeSourceId, setActiveSourceId] = useState<string>('src-1')
  const [activeFocusId, setActiveFocusId] = useState<string>('ex-1')

  const activeSource = useMemo(
    () => sources.find((s) => s.id === activeSourceId) ?? null,
    [sources, activeSourceId],
  )

  const activeExercise = useMemo(
    () => activeSource?.exercises.find((e) => e.id === activeFocusId) ?? null,
    [activeSource, activeFocusId],
  )

  return (
    <WorkspaceContext.Provider
      value={{
        sources,
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
