import { memo } from 'react'
import { Zap } from 'lucide-react'
import { Button } from '../ui/button'
import { useWorkspace } from './workspace-context'

export const ExtendedPracticeSection = memo(function ExtendedPracticeSection() {
  const { activeExercise } = useWorkspace()

  if (!activeExercise) {
    return null
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
        Luyện tập mở rộng
      </p>

      <div className="rounded-lg border border-border bg-card p-4 text-center">
        <p className="text-sm text-muted-foreground mb-3">
          Yêu cầu AI tạo ra một bài tập mới cùng dạng nhưng độ khó truc định
        </p>
        <Button type="button" size="sm" variant="default" className="w-full">
          <Zap className="h-4 w-4" />
          <span>Tạo bài tập tương tự</span>
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card p-4 text-center">
        <p className="text-sm text-muted-foreground mb-3">
          Yêu cầu AI tạo một bài tập nâng cao hơn hiện tại
        </p>
        <Button type="button" size="sm" variant="outline" className="w-full">
          <Zap className="h-4 w-4" />
          <span>Bài nâng cao</span>
        </Button>
      </div>
    </div>
  )
})
