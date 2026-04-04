import { ExerciseSelector } from './exercise-selector'
import { ExerciseMessageInput } from './exercise-message-input'
import { useWorkspace } from './workspace-context'

export function WorkspaceFooter() {
  const { activeSourceId } = useWorkspace()

  if (!activeSourceId) {
    return null
  }

  return (
    <footer className="border-t border-border p-4" id='workspace-footer'>
      <ExerciseSelector />
      <ExerciseMessageInput />
    </footer>
  )
}
