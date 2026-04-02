import { useState } from 'react'

import { Loader2, Pencil, Plus, Trash2, UserRound } from 'lucide-react'
import { toast } from 'sonner'

import type { Child } from '#/api/types'
import { useAddChild, useDeleteChild, useUpdateChild } from '#/hooks/api/useProfile'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { useWorkspace } from './workspace-context'

type ChildFormState = {
  name: string
  className: string
  learningNotes: string
}

function toChildFormState(child: Child | null): ChildFormState {
  if (!child) {
    return {
      name: '',
      className: '',
      learningNotes: '',
    }
  }

  return {
    name: child.name,
    className: child.class ?? child.grade ?? '',
    learningNotes: child.learning_notes ?? '',
  }
}

export function WorkspaceChildrenDialog({
  open,
  onOpenChange,
  blocking,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  blocking?: boolean
}) {
  const {
    children,
    selectedChild,
    selectedChildId,
    setSelectedChildId,
    isChildrenLoading,
  } = useWorkspace()
  const addChild = useAddChild()
  const updateChild = useUpdateChild()
  const deleteChild = useDeleteChild()
  const [childForm, setChildForm] = useState<ChildFormState>(toChildFormState(selectedChild))
  const [newChildForm, setNewChildForm] = useState<ChildFormState>({
    name: '',
    className: '',
    learningNotes: '',
  })

  const isPending = addChild.isPending || updateChild.isPending || deleteChild.isPending
  const showBlockingMessage = blocking && children.length === 0

  const handleSelectChild = (child: Child) => {
    setSelectedChildId(child.id)
    setChildForm(toChildFormState(child))
  }

  const handleAddChild = async () => {
    if (!newChildForm.name.trim()) {
      toast.error('Vui lòng nhập tên học sinh.')
      return
    }

    try {
      const createdChild = await addChild.mutateAsync({
        name: newChildForm.name.trim(),
        class: newChildForm.className.trim() || null,
        learning_notes: newChildForm.learningNotes.trim() || null,
      })

      setSelectedChildId(createdChild.id)
      setChildForm(toChildFormState(createdChild))
      setNewChildForm({ name: '', className: '', learningNotes: '' })
      toast.success('Đã thêm học sinh mới.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể thêm học sinh.')
    }
  }

  const handleUpdateChild = async () => {
    if (!selectedChildId || !childForm.name.trim()) {
      toast.error('Vui lòng chọn học sinh và nhập tên hợp lệ.')
      return
    }

    try {
      await updateChild.mutateAsync({
        id: selectedChildId,
        payload: {
          name: childForm.name.trim(),
          class: childForm.className.trim() || null,
          learning_notes: childForm.learningNotes.trim() || null,
        },
      })
      toast.success('Đã cập nhật thông tin học sinh.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể cập nhật học sinh.')
    }
  }

  const handleDeleteChild = async () => {
    if (!selectedChildId) {
      toast.error('Vui lòng chọn học sinh cần xóa.')
      return
    }

    try {
      await deleteChild.mutateAsync(selectedChildId)
      const fallbackChild = children.find((child) => child.id !== selectedChildId)
      setSelectedChildId(fallbackChild?.id ?? null)
      setChildForm(toChildFormState(fallbackChild ?? null))
      toast.success('Đã xóa học sinh.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể xóa học sinh.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] grid-rows-[auto_minmax(0,1fr)_auto] sm:max-w-4xl"
        showCloseButton={!showBlockingMessage}
        onInteractOutside={(event) => {
          if (showBlockingMessage) {
            event.preventDefault()
          }
        }}
        onEscapeKeyDown={(event) => {
          if (showBlockingMessage) {
            event.preventDefault()
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Hồ sơ học tập</DialogTitle>
          <DialogDescription>
            {showBlockingMessage
              ? 'Bạn cần tạo ít nhất 1 học sinh trước khi sử dụng workspace.'
              : 'Chọn, chỉnh sửa hoặc thêm học sinh cho phiên học hiện tại.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid min-h-0 gap-4 md:grid-cols-[260px_minmax(0,1fr)]">
          <div className="min-h-0 rounded-2xl border border-border bg-card p-3">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Danh sách học sinh
            </p>
            <div className="space-y-2 overflow-auto pr-1">
              {isChildrenLoading ? (
                <div className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang tải danh sách...
                </div>
              ) : null}

              {children.map((child) => (
                <button
                  key={child.id}
                  type="button"
                  onClick={() => handleSelectChild(child)}
                  className={`w-full rounded-xl border px-3 py-2 text-left transition-colors ${
                    child.id === selectedChildId
                      ? 'border-ring bg-accent text-accent-foreground'
                      : 'border-border bg-background hover:bg-accent'
                  }`}
                >
                  <p className="truncate text-sm font-semibold">{child.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {child.class ?? child.grade ?? 'Chưa có lớp'}
                  </p>
                </button>
              ))}

              {!isChildrenLoading && children.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border px-3 py-2 text-sm text-muted-foreground">
                  Chưa có học sinh.
                </div>
              ) : null}
            </div>
          </div>

          <div className="min-h-0 space-y-4 overflow-auto pr-1">
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Pencil className="h-4 w-4" />
                Chỉnh sửa học sinh đang chọn
              </div>

              <div className="grid gap-3">
                <Input
                  placeholder="Tên học sinh"
                  value={childForm.name}
                  onChange={(event) =>
                    setChildForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  disabled={!selectedChildId || isPending}
                />
                <Input
                  placeholder="Lớp"
                  value={childForm.className}
                  onChange={(event) =>
                    setChildForm((prev) => ({ ...prev, className: event.target.value }))
                  }
                  disabled={!selectedChildId || isPending}
                />
                <Textarea
                  placeholder="Ghi chú học tập"
                  value={childForm.learningNotes}
                  onChange={(event) =>
                    setChildForm((prev) => ({ ...prev, learningNotes: event.target.value }))
                  }
                  disabled={!selectedChildId || isPending}
                />
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Button type="button" onClick={handleUpdateChild} disabled={!selectedChildId || isPending}>
                  Lưu thay đổi
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteChild}
                  disabled={!selectedChildId || isPending || (showBlockingMessage && children.length <= 1)}
                >
                  <Trash2 className="h-4 w-4" />
                  Xóa
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <UserRound className="h-4 w-4" />
                Thêm học sinh mới
              </div>

              <div className="grid gap-3">
                <Input
                  placeholder="Tên học sinh"
                  value={newChildForm.name}
                  onChange={(event) =>
                    setNewChildForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  disabled={isPending}
                />
                <Input
                  placeholder="Lớp"
                  value={newChildForm.className}
                  onChange={(event) =>
                    setNewChildForm((prev) => ({ ...prev, className: event.target.value }))
                  }
                  disabled={isPending}
                />
                <Textarea
                  placeholder="Ghi chú học tập"
                  value={newChildForm.learningNotes}
                  onChange={(event) =>
                    setNewChildForm((prev) => ({ ...prev, learningNotes: event.target.value }))
                  }
                  disabled={isPending}
                />
              </div>

              <div className="mt-3">
                <Button type="button" onClick={handleAddChild} disabled={isPending}>
                  <Plus className="h-4 w-4" />
                  Thêm học sinh
                </Button>
              </div>
            </div>
          </div>
        </div>

        {showBlockingMessage ? (
          <DialogFooter>
            <p className="text-xs text-muted-foreground">
              Sau khi thêm học sinh đầu tiên, bạn sẽ tiếp tục vào workspace.
            </p>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}