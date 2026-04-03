import { memo, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { useWorkspace } from './workspace-context'

export const ReferenceSolutionSection = memo(function ReferenceSolutionSection() {
  const { activeExercise } = useWorkspace()
  const [isEditMode, setIsEditMode] = useState(false)

  if (!activeExercise) {
    return null
  }

  return (
    <div className="space-y-3 border-b border-border pb-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Bài giải tham khảo
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-3 min-h-20">
        {isEditMode ? (
          <textarea
            placeholder="Nhập bài giải tham khảo..."
            className="w-full h-24 p-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-ring outline-none"
            defaultValue=""
          />
        ) : (
          <p className="text-sm text-muted-foreground">Chưa có bài giải tham khảo</p>
        )}
      </div>

      {isEditMode && (
        <div className="flex gap-2">
          <Button type="button" size="sm" variant="default">
            <Plus className="h-4 w-4" />
            <span>Thêm ảnh</span>
          </Button>
          <Button type="button" size="sm" variant="destructive">
            <Trash2 className="h-4 w-4" />
            <span>Xóa</span>
          </Button>
        </div>
      )}
    </div>
  )
})
