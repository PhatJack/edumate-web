import { SidebarProvider } from '#/components/ui/sidebar'
import { createFileRoute } from '@tanstack/react-router'
import { WorkspaceProvider } from '#/components/workspace/workspace-context'
import { WorkspaceSidebar } from '#/components/workspace/workspace-sidebar'
import { WorkspaceHeader } from '#/components/workspace/workspace-header'
import { WorkspaceMain } from '#/components/workspace/workspace-main'
import { WorkspaceChildrenDialog } from '#/components/workspace/workspace-children-dialog.tsx'
import { useWorkspace } from '#/components/workspace/workspace-context'

export const Route = createFileRoute('/_authenticated/')({
  component: IndexRoute,
})

function IndexRoute() {
  return (
    <WorkspaceProvider>
      <WorkspaceWithChildrenGate />
    </WorkspaceProvider>
  )
}

function WorkspaceWithChildrenGate() {
  const { children, isChildrenLoading } = useWorkspace()
  const shouldBlock = !isChildrenLoading && children.length === 0

  return (
    <>
      <SidebarProvider>
        <main className="flex h-screen w-full overflow-hidden">
          <WorkspaceSidebar />
          <section className="flex min-w-0 flex-1 flex-col">
            <WorkspaceHeader />
            <WorkspaceMain />
          </section>
        </main>
      </SidebarProvider>

      <WorkspaceChildrenDialog
        open={shouldBlock}
        onOpenChange={() => {
          // Blocking gate: do not allow closing manually when there are no children.
        }}
        blocking
      />
    </>
  )
}
