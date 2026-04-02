import { useState } from 'react'

import { Eye, GraduationCap, Loader2, Plus, Trash2 } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { signOut } from 'firebase/auth'
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
import { auth } from '#/firebase'
import { useLogout } from '#/hooks/api/useAuth'
import {
  AddDocumentDialog,
  DeleteDocumentDialog,
  DocumentPreviewDialog,
} from './workspace-document-dialogs'
import type { Source } from './workspace-context'
import { WorkspaceChildrenDialog } from './workspace-children-dialog.tsx'

export function WorkspaceSidebar() {
  const {
    sources,
    activeSourceId,
    setActiveSourceId,
    setActiveFocusId,
    isLoading,
    error,
    selectedChild,
  } = useWorkspace()
  const { setOpenMobile } = useSidebar()
  const navigate = useNavigate()
  const logout = useLogout()
  const [logoutError, setLogoutError] = useState<string | null>(null)
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false)
  const [isChildrenDialogOpen, setIsChildrenDialogOpen] = useState(false)
  const [previewDocument, setPreviewDocument] = useState<Source | null>(null)
  const [deleteDocument, setDeleteDocument] = useState<Source | null>(null)

  const handleLogout = async () => {
    setLogoutError(null)

    try {
      await signOut(auth)
      await navigate({ to: '/login', search: { redirect: '/' } })
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Không thể đăng xuất ngay lúc này.'
      setLogoutError(message)
    }
  }

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
          type="button"
          onClick={() => setIsAddDocumentOpen(true)}
          className="w-full rounded-xl bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Thêm tài liệu học
        </Button>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <div className="space-y-2">
              {isLoading && sources.length === 0 ? (
                <div className="flex items-center gap-2 rounded-xl border border-border bg-sidebar px-3 py-4 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang tải danh sách tài liệu...
                </div>
              ) : null}

              {!isLoading && sources.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-sidebar px-3 py-4 text-sm text-muted-foreground">
                  Chưa có tài liệu nào trong danh sách quản lý.
                </div>
              ) : null}

              {error ? (
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-4 text-sm text-destructive">
                  {error}
                </div>
              ) : null}

              {sources.map((source) => (
                <div key={source.id} className="group relative">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSourceId(source.id)
                      setActiveFocusId(source.exercises[0]?.id ?? null)
                      setOpenMobile(false)
                    }}
                    className={`w-full rounded-xl border px-3 py-2 pr-24 text-left transition-colors ${
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

                  <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 opacity-0 transition-all group-hover:opacity-100 group-focus-within:opacity-100">
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon-xs"
                      onClick={() => setPreviewDocument(source)}
                      className="rounded-md"
                      aria-label={`Xem ${source.name}`}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon-xs"
                      onClick={() => setDeleteDocument(source)}
                      className="rounded-md text-destructive hover:text-destructive"
                      aria-label={`Xóa ${source.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <button
          type="button"
          onClick={() => setIsChildrenDialogOpen(true)}
          id="tour-profile"
          className="w-full rounded-xl border border-border bg-muted p-3 text-left transition-colors hover:bg-accent"
        >
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Hồ sơ học tập
          </p>
          <p className="mt-1 text-sm font-semibold text-sidebar-foreground">
            {selectedChild
              ? `${selectedChild.name} - ${selectedChild.class ?? selectedChild.grade ?? 'Chưa có lớp'}`
              : 'Chưa chọn học sinh'}
          </p>
        </button>

        <Button
          type="button"
          variant="outline"
          onClick={handleLogout}
          disabled={logout.isPending}
          className="mt-3 w-full"
        >
          {logout.isPending ? 'Đang đăng xuất...' : 'Đăng xuất'}
        </Button>

        {logoutError ? (
          <p className="mt-2 text-xs text-destructive" aria-live="polite">
            {logoutError}
          </p>
        ) : null}
      </SidebarFooter>

      <AddDocumentDialog
        open={isAddDocumentOpen}
        onOpenChange={setIsAddDocumentOpen}
      />
      <DocumentPreviewDialog
        document={previewDocument}
        open={!!previewDocument}
        onOpenChange={(open) => {
          if (!open) {
            setPreviewDocument(null)
          }
        }}
      />
      <DeleteDocumentDialog
        document={deleteDocument}
        open={!!deleteDocument}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteDocument(null)
          }
        }}
      />
      <WorkspaceChildrenDialog
        open={isChildrenDialogOpen}
        onOpenChange={setIsChildrenDialogOpen}
      />
    </Sidebar>
  )
}
