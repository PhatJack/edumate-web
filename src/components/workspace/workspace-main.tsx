import { Bot, BookOpen, ListTodo } from 'lucide-react'
import { useWorkspace } from './workspace-context'
import { ScrollArea } from '#/components/ui/scroll-area'
import { useState } from 'react'

export function WorkspaceMain() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <WorkspaceExerciseDetail />
      <WorkspaceFooter />
    </div>
  )
}

function WorkspaceExerciseDetail() {
  const { activeExercise } = useWorkspace()

  return (
    <ScrollArea className="min-h-0 flex-1 p-4">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
        <Bot className="h-4 w-4" />
        Edumate đã sẵn sàng hỗ trợ ba mẹ.
      </div>
      <div
        id="tour-question-detail"
        className="rounded-2xl border border-border bg-card p-4"
      >
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Đề bài đang chọn
        </p>
        <h2 className="mb-2 text-base font-bold text-card-foreground">
          {activeExercise?.title ?? 'Chưa chọn bài tập'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {activeExercise?.detail ?? 'Vui lòng chọn bài tập ở thanh bên dưới.'}
        </p>
      </div>
    </ScrollArea>
  )
}

function WorkspaceFooter() {
  const { activeSource, activeFocusId, setActiveFocusId } = useWorkspace()
  const [input, setInput] = useState('')

  return (
    <footer className="border-t border-border p-4">
      <div id="tour-focus-target" className="mb-3">
        <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Chọn bài tập mục tiêu
        </label>
        <div className="grid gap-2 sm:grid-cols-2">
          {activeSource?.exercises.map((exercise) => (
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
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Nhập câu hỏi để nhận gợi ý giảng bài..."
          className="min-h-[44px] flex-1 resize-none bg-transparent px-3 py-2 text-sm text-foreground outline-none"
        />
        <button
          type="button"
          className="rounded-xl bg-primary hover:bg-primary/90 px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors"
        >
          <BookOpen className="h-4 w-4" />
        </button>
      </div>
    </footer>
  )
}
