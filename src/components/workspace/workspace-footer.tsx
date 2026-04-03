import { useWorkspace } from './workspace-context'
import { ExerciseSelector } from './exercise-selector'
import { ExerciseMessageInput } from './exercise-message-input'

export function WorkspaceFooter() {
  const { activeSource } = useWorkspace()

  if (!activeSource) {
    return null
  }

  return (
    <footer className="border-t border-border p-4">
      <ExerciseSelector />
      <ExerciseMessageInput />
    </footer>
  )
}
