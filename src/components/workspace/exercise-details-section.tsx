import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Loader2, Save } from 'lucide-react'
import { useWorkspace } from './workspace-context'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { useExerciseDetail, useUpdateExercise } from '#/hooks/api/useExercises'

function sanitizeHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son\w+\s*=\s*'[^']*'/gi, '')
    .replace(/\sjavascript:/gi, '')
}

export const ExerciseDetailsSection = memo(function ExerciseDetailsSection() {
  const { activeExercise, activeSourceId } = useWorkspace()
  const updateExercise = useUpdateExercise()
  const exerciseDetailQuery = useExerciseDetail(
    activeSourceId ?? '',
    activeExercise?.id ?? '',
  )
  const editorRef = useRef<HTMLDivElement | null>(null)
  const [htmlContent, setHtmlContent] = useState('')
  const [isDirty, setIsDirty] = useState(false)

  if (!activeExercise) {
    return null
  }

  const serverHtml =
    exerciseDetailQuery.data?.html_content ?? activeExercise.html_content ?? ''

  useEffect(() => {
    const nextHtml = sanitizeHtml(serverHtml || '<p></p>')
    setHtmlContent(nextHtml)
    setIsDirty(false)

    if (editorRef.current && editorRef.current.innerHTML !== nextHtml) {
      editorRef.current.innerHTML = nextHtml
    }
  }, [activeExercise.id, serverHtml])

  const handleInput = useCallback(
    (event: React.FormEvent<HTMLDivElement>) => {
      const nextHtml = sanitizeHtml(event.currentTarget.innerHTML)
      setHtmlContent(nextHtml)
      setIsDirty(nextHtml !== sanitizeHtml(serverHtml || '<p></p>'))
    },
    [serverHtml],
  )

  const handleSave = useCallback(async () => {
    if (!activeSourceId || !activeExercise) {
      return
    }

    const sanitizedContent = sanitizeHtml(htmlContent).trim()
    if (!sanitizedContent) {
      toast.error('Nội dung đề bài không được để trống.')
      return
    }

    try {
      await updateExercise.mutateAsync({
        exerciseId: activeExercise.id,
        documentId: activeSourceId,
        payload: {
          html_content: sanitizedContent,
        },
      })
      setIsDirty(false)
      toast.success('Đã lưu nội dung đề bài.')
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Không thể cập nhật đề bài ngay lúc này.',
      )
    }
  }, [activeExercise, activeSourceId, htmlContent, updateExercise])

  return (
    <section className="space-y-3 border-b border-border pb-6">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Chi tiết đề bài
      </p>

      <div className="rounded-2xl border border-primary/70 bg-card p-3 shadow-[0_0_0_3px_rgba(79,70,229,0.06)]">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          className="min-h-30 rounded-md border border-transparent bg-transparent px-2 py-2 text-base leading-relaxed text-foreground outline-none focus-visible:ring-0"
        />

        <div className="mt-3 flex items-center justify-end gap-2">
          <Button
            type="button"
            className="rounded-xl px-5"
            onClick={handleSave}
            disabled={updateExercise.isPending || !isDirty}
          >
            {updateExercise.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Lưu
          </Button>
        </div>
      </div>
    </section>
  )
})
