import { memo } from 'react'
import { Save } from 'lucide-react'
import { useWorkspace } from './workspace-context'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'

export const ExerciseDetailsSection = memo(function ExerciseDetailsSection() {
  const { activeExercise } = useWorkspace()

  if (!activeExercise) {
    return null
  }

  return (
    <section className="space-y-3 border-b border-border pb-6">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Chi tiết đề bài
      </p>

      <div className="rounded-2xl border border-primary/70 bg-card p-3 shadow-[0_0_0_3px_rgba(79,70,229,0.06)]">
        <Textarea
          value={activeExercise.detail}
          className="min-h-30 resize-none border-border/0 bg-muted/50 text-base leading-relaxed text-foreground focus-visible:ring-0"
        />

        <div className="mt-3 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            className="text-muted-foreground"
          >
            Hủy
          </Button>
          <Button type="button" className="rounded-xl px-5">
            <Save className="h-4 w-4" />
            Lưu
          </Button>
        </div>
      </div>
    </section>
  )
})
