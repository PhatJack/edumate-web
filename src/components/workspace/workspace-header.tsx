import { PlayCircle, BookOpen } from 'lucide-react'
import { useWorkspace } from './workspace-context'
import { SidebarTrigger } from '#/components/ui/sidebar'
import { Button } from '#/components/ui/button'
import { useIsMobile } from '#/hooks/use-mobile'

export function WorkspaceHeader() {
  const { activeSource, activeExercise, setIsExercisePanelOpen } = useWorkspace()
  const isMobile = useIsMobile()

  const startTour = () => {}

  const handleOpenExercisePanel = () => {
    setIsExercisePanelOpen(true)
  }

  return (
    <header className="flex items-center justify-between border-b border-border px-4 py-3">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h1 className="truncate text-sm font-bold text-foreground">
          {activeSource?.name ?? ''}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Button type="button" onClick={startTour} variant="default">
          <PlayCircle className="h-4 w-4" />
          <span>Xem hướng dẫn</span>
        </Button>
        {activeExercise && (
          <Button
            type="button"
            size={isMobile ? 'icon' : 'default'}
            variant="secondary"
            onClick={handleOpenExercisePanel}
            title="Quản lý bài tập"
          >
            <BookOpen className="h-4 w-4" />
            <span className="md:inline-block hidden">Chi tiết</span>
          </Button>
        )}
      </div>
    </header>
  )
}
