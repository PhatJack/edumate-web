import { GraduationCap } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  useSidebar,
} from '#/components/ui/sidebar'
import { Button } from '#/components/ui/button'
import { useWorkspace } from './workspace-context'

export function WorkspaceSidebar() {
  const { sources, activeSourceId, setActiveSourceId, setActiveFocusId } = useWorkspace()
  const { setOpenMobile } = useSidebar()

  return (
    <Sidebar className="border-r border-border bg-sidebar">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="rounded-xl bg-primary p-2 text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold text-sidebar-foreground">Edumate</h2>
        </div>
        <Button
          id="tour-add-doc"
          className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
        >
          Thêm tài liệu học
        </Button>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <div className="space-y-2">
              {sources.map((source) => (
                <button
                  key={source.id}
                  type="button"
                  onClick={() => {
                    setActiveSourceId(source.id)
                    setActiveFocusId(source.exercises[0]?.id ?? '')
                    setOpenMobile(false)
                  }}
                  className={`w-full rounded-xl border px-3 py-2 text-left transition-colors ${
                    source.id === activeSourceId
                      ? 'border-sidebar-ring bg-sidebar-accent'
                      : 'border-border bg-sidebar hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`}
                >
                  <p className="truncate text-sm font-semibold text-sidebar-foreground">
                    {source.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {source.exercises.length} bài tập
                  </p>
                </button>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div
          id="tour-profile"
          className="rounded-xl border border-border bg-muted p-3"
        >
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Hồ sơ học tập
          </p>
          <p className="mt-1 text-sm font-semibold text-sidebar-foreground">
            Bé Moon - Lớp 4A
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
