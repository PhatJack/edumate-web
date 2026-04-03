import { ExerciseSelector } from './exercise-selector'
import { ExerciseMessageInput } from './exercise-message-input'

export function WorkspaceFooter() {
  return (
    <footer className="border-t border-border p-4">
      <ExerciseSelector />
      <ExerciseMessageInput />
    </footer>
  )
}
