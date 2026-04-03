import { memo } from 'react'
import { useWorkspace } from './workspace-context'

export const ExerciseDetailsSection = memo(function ExerciseDetailsSection() {
  const { activeExercise } = useWorkspace()

  if (!activeExercise) {
    return null
  }

  return (
    <div className="space-y-3 border-b border-border pb-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">
          Đề bài
        </p>
        <div className="rounded-lg border border-border bg-card p-3">
          <h3 className="font-semibold text-card-foreground mb-2">{activeExercise.title}</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{activeExercise.detail}</p>
        </div>
      </div>
    </div>
  )
})
