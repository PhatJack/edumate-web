import { PlayCircle } from 'lucide-react'
import { useWorkspace } from './workspace-context'
import { SidebarTrigger } from '#/components/ui/sidebar'
import { Button } from '#/components/ui/button'
import ThemeToggle from '../ThemeToggle'

export function WorkspaceHeader() {
  const { activeSource } = useWorkspace()

  const startTour = () => {}

  return (
    <header className="flex items-center justify-between border-b border-border px-4 py-3">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <ThemeToggle />
        <h1 className="truncate text-sm font-bold text-foreground">
          {activeSource?.name ?? 'Không có tài liệu'}
        </h1>
      </div>

      <Button type="button" onClick={startTour} variant="default">
        <PlayCircle className="h-4 w-4" />
        <span>Xem hướng dẫn</span>
      </Button>
    </header>
  )
}
