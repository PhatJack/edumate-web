import { BookOpen, ListTodo } from 'lucide-react'

import { useWorkspace } from './workspace-context'

export function WorkspaceFooter() {
  const { activeSource, activeFocusId, setActiveFocusId } = useWorkspace()

  if (!activeSource) {
    return null
  }

  return (
    <footer className="border-t border-border p-4">
      <div id="tour-focus-target" className="mb-3">
        <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Chọn bài tập mục tiêu
        </label>
        <div className="grid gap-2 sm:grid-cols-2">
          {activeSource.exercises.map((exercise) => (
            <button
              key={exercise.id}
              type="button"
              onClick={() => setActiveFocusId(exercise.id)}
              className={`rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                exercise.id === activeFocusId
                  ? 'border-ring bg-accent text-accent-foreground'
                  : 'border-border bg-card text-card-foreground hover:bg-accent'
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <ListTodo className="h-4 w-4" />
                {exercise.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-end gap-2 rounded-2xl border border-border p-2">
        <textarea
          rows={1}
          placeholder="Nhập câu hỏi để nhận gợi ý giảng bài..."
          className="min-h-11 flex-1 resize-none bg-transparent px-3 py-2 text-sm text-foreground outline-none"
        />
        <button
          type="button"
          className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <BookOpen className="h-4 w-4" />
        </button>
      </div>
    </footer>
  )
}