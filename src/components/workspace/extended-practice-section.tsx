import { memo, useState } from 'react'
import { Loader2, Plus } from 'lucide-react'
import { Button } from '../ui/button'
import { useWorkspace } from './workspace-context'
import { Textarea } from '../ui/textarea'
import { useCreateSimilarExercise } from '#/hooks/api/useExercises'
import { toast } from 'sonner'

export const ExtendedPracticeSection = memo(function ExtendedPracticeSection() {
  const { isTourSampleDocumentActive } = useWorkspace()

  if (isTourSampleDocumentActive) {
    return <TourSampleExtendedPracticeSection />
  }

  return <LiveExtendedPracticeSection />
})

function TourSampleExtendedPracticeSection() {
  const { activeExercise } = useWorkspace()

  if (!activeExercise) {
    return null
  }

  return (
    <section className="space-y-3 pb-2" id="extended-practice-section">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Luyện tập mở rộng
      </p>
      <p className="text-sm text-muted-foreground">
        Yêu cầu AI tạo ra một bài tập mới cùng dạng thức để con ôn luyện sâu hơn.
      </p>

      <div className="rounded-2xl border border-border bg-card p-1">
        <Textarea
          value={activeExercise.title ?? ''}
          onChange={() => undefined}
          placeholder="Ghi chú yêu cầu (ví dụ: đổi nhân vật, số liệu nhỏ hơn)..."
          className="min-h-21 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
          disabled
        />
      </div>

      <Button
        type="button"
        variant="outline"
        disabled
        size={'lg'}
        className="w-full rounded-xl border-indigo-200 bg-indigo-500 text-indigo-50 hover:bg-indigo-100"
      >
        <Plus className="h-4 w-4" />
        Bắt đầu tạo bài
      </Button>
    </section>
  )
}

function LiveExtendedPracticeSection() {
  const createSimilar = useCreateSimilarExercise()
  const { activeExercise, activeSourceId } = useWorkspace()
  const [hint, setHint] = useState('')

  if (!activeExercise) {
    return null
  }

  const handleSave = async () => {
    if (!activeSourceId || !activeExercise) {
      return
    }
    try {
      await createSimilar.mutateAsync({
        documentId: activeSourceId,
        exerciseId: activeExercise.id,
        hint,
      })
      setHint('')
      toast.success('Đã tạo bài tập mới.')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Không thể tạo bài tập mới.',
      )
    }
  }

  return (
    <section className="space-y-3 pb-2" id="extended-practice-section">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Luyện tập mở rộng
      </p>
      <p className="text-sm text-muted-foreground">
        Yêu cầu AI tạo ra một bài tập mới cùng dạng thức để con ôn luyện sâu
        hơn.
      </p>

      <div className="rounded-2xl border border-border bg-card p-1">
        <Textarea
          value={hint}
          onChange={(e) => setHint(e.target.value)}
          placeholder="Ghi chú yêu cầu (ví dụ: đổi nhân vật, số liệu nhỏ hơn)..."
          className="min-h-21 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
        />
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleSave}
        disabled={!hint.trim() || createSimilar.isPending}
        size={'lg'}
        className="w-full rounded-xl border-indigo-200 bg-indigo-500 text-indigo-50 hover:bg-indigo-100"
      >
        {createSimilar.isPending ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Đang tạo bài tập mới...
          </span>
        ) : (
          <>
            <Plus className="h-4 w-4" />
            Bắt đầu tạo bài
          </>
        )}
      </Button>
    </section>
  )
}
