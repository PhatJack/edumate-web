import { memo, useState } from 'react'
import { Save } from 'lucide-react'
import { useWorkspace } from './workspace-context'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { useUpdateExercise } from '#/hooks/api/useExercises'

export const ExerciseDetailsSection = memo(function ExerciseDetailsSection() {
  const { activeExercise, activeSourceId } = useWorkspace()
  const updateExercise = useUpdateExercise()
  const [htmlContent, setHtmlContent] = useState(
    activeExercise?.html_content ?? '',
  )

  if (!activeExercise) {
    return null
  }

  const handleSave = async () => {
    if (!activeSourceId || !activeExercise) {
      return
    }
    try {
      await updateExercise.mutateAsync({
        exerciseId: activeExercise.id,
        documentId: activeSourceId,
        payload: {
          html_content: htmlContent,
        },
      })
    } catch (error) {
      console.error('Failed to update exercise detail:', error)
    }
  }
  return (
    <section className="space-y-3 border-b border-border pb-6">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Chi tiết đề bài
      </p>

      <div className="rounded-2xl border border-primary/70 bg-card p-3 shadow-[0_0_0_3px_rgba(79,70,229,0.06)]">
        <Textarea
          value={htmlContent}
          onChange={(e) => setHtmlContent(e.target.value)}
          className="min-h-30 resize-none border-border/0 bg-transparent shadow-none text-base leading-relaxed text-foreground focus-visible:ring-0"
        />

        <div className="mt-3 flex items-center justify-end gap-2">
          <Button
            type="button"
            className="rounded-xl px-5"
            onClick={handleSave}
          >
            <Save className="h-4 w-4" />
            Lưu
          </Button>
        </div>
      </div>
    </section>
  )
})
