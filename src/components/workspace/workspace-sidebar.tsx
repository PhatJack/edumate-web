import { useState } from 'react'

import { Loader2, Plus } from 'lucide-react'
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
import { WorkspaceChildrenDialog } from './workspace-children-dialog.tsx'
import { WorkspaceSourceItem } from './workspace-source-item'
import type { Document } from '#/api/types.ts'

export function WorkspaceSidebar() {
  const {
    documents,
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
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null)
  const [deleteDocument, setDeleteDocument] = useState<Document | null>(null)

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
          <div className="rounded-xl bg-primary-foreground p-2">
            <img
              src="/edumate_logo.svg"
              alt="Edumate Logo"
              className="size-6"
            />
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
            <div className="space-y-2" id="workspace-source-list">
							 <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
								Danh sách quản lý
								</p>
              {isLoading && documents.length === 0 ? (
                <div className="flex items-center gap-2 rounded-xl border border-border bg-sidebar px-3 py-4 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang tải danh sách tài liệu...
                </div>
              ) : null}

              {!isLoading && documents.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-sidebar px-3 py-4 text-sm text-muted-foreground">
                  Chưa có tài liệu nào trong danh sách quản lý.
                </div>
              ) : null}

              {error ? (
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-4 text-sm text-destructive">
                  {error}
                </div>
              ) : null}

              {documents.map((document) => (
                <WorkspaceSourceItem
                  key={document.id}
                  source={document}
                  isActive={document.id === activeSourceId}
                  onSelect={(selectedDocument) => {
                    setActiveSourceId(selectedDocument.id)
                    setActiveFocusId(
                      selectedDocument.exercises?.[0]?.id as string | null,
                    )
                    setOpenMobile(false)
                  }}
                  onPreview={setPreviewDocument}
                  onDelete={setDeleteDocument}
                />
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
          className="w-full rounded-xl border border-border bg-muted p-3 text-left transition-colors hover:bg-accent cursor-pointer"
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
