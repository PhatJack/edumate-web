import { memo } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '../ui/button'
import { useWorkspace } from './workspace-context'
import { Textarea } from '../ui/textarea'

export const ExtendedPracticeSection = memo(function ExtendedPracticeSection() {
  const { activeExercise } = useWorkspace()

  if (!activeExercise) {
    return null
  }

  return (
    <section className="space-y-3 pb-2">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Luyện tập mở rộng
      </p>
      <p className="text-sm text-muted-foreground">
        Yêu cầu AI tạo ra một bài tập mới cùng dạng thức để con ôn luyện sâu
        hơn.
      </p>

      <div className="rounded-2xl border border-border bg-card p-3">
        <Textarea
          placeholder="Ghi chú yêu cầu (ví dụ: đổi nhân vật, số liệu nhỏ hơn)..."
          className="min-h-21 resize-none border-0 bg-transparent px-2 shadow-none focus-visible:ring-0"
        />
      </div>

      <Button
        type="button"
        variant="outline"
        className="h-12 w-full rounded-xl border-indigo-200 bg-indigo-50 text-indigo-500 hover:bg-indigo-100"
      >
        <Plus className="h-4 w-4" />
        Bắt đầu tạo bài
      </Button>
    </section>
  )
})
