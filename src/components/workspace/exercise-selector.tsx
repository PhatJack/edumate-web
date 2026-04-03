import { memo } from 'react'
import { useWorkspace } from './workspace-context'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'

export const ExerciseSelector = memo(function ExerciseSelector() {
  const { activeSource, activeFocusId, setActiveFocusId } = useWorkspace()

  if (!activeSource || activeSource.exercises.length === 0) {
    return null
  }

  return (
    <div id="tour-focus-target" className="mb-3">
      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
        Chọn bài tập mục tiêu
      </label>
      <Select value={activeFocusId ?? ''} onValueChange={setActiveFocusId}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Chọn một bài tập..." />
        </SelectTrigger>
        <SelectContent>
          {activeSource.exercises.map((exercise) => (
            <SelectItem key={exercise.id} value={exercise.id}>
              {exercise.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
})
