import { BookOpen, Bot } from 'lucide-react'

import { useWorkspace } from './workspace-context'
import { ScrollArea } from '#/components/ui/scroll-area'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '#/components/ui/empty'
import { WorkspaceFooter } from './workspace-footer'

export function WorkspaceMain() {
  const { activeSource, isLoading } = useWorkspace()

  if (isLoading && !activeSource) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center p-4">
        <Empty className="max-w-2xl border-border bg-card">
          <EmptyContent>
            <EmptyMedia variant="icon">
              <BookOpen className="h-6 w-6 text-muted-foreground" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>Đang tải tài liệu</EmptyTitle>
              <EmptyDescription>
                Vui lòng chờ trong giây lát để danh sách tài liệu hoàn tất tải.
              </EmptyDescription>
            </EmptyHeader>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  if (!activeSource) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center p-4">
        <Empty className="max-w-2xl border-border bg-card">
          <EmptyContent>
            <EmptyMedia variant="icon">
              <BookOpen className="h-6 w-6 text-muted-foreground" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>Không gian làm việc trống</EmptyTitle>
              <EmptyDescription>
                Ba mẹ vui lòng chọn hoặc thêm một tài liệu ở danh sách bên trái để sử dụng chức năng.
              </EmptyDescription>
            </EmptyHeader>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

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
