import { memo, useEffect, useMemo, useRef } from 'react'
import { Bot, ChevronRight, UserRound } from 'lucide-react'

import { useWorkspace } from './workspace-context'
import { useIsSendingMessage, useMessages } from '#/hooks/api/useChat'
import { cn } from '#/lib/utils'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import type { Exercise } from '#/api/types'

export const ExerciseMessageBoard = memo(function ExerciseMessageBoard() {
  const { isTourSampleDocumentActive } = useWorkspace()

  if (isTourSampleDocumentActive) {
    return <TourSampleMessageBoard />
  }

  return <LiveExerciseMessageBoard />
})

function TourSampleMessageBoard() {
  const { activeSource, activeFocusId, setActiveFocusId } = useWorkspace()

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground shadow-sm">
        Đây là giao diện mẫu dành cho tour. Khi ba mẹ tải tài liệu thật, Edumate
        mới kết nối dữ liệu và bắt đầu hội thoại.
      </div>

      <div className="rounded-2xl border border-border bg-card px-4 py-4 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Danh sách bài tập
        </p>
        <div className="mt-3 space-y-2">
          {activeSource?.exercises?.map((exercise) => {
            const isActive = activeFocusId === exercise.id

            return (
              <Button
                type="button"
                key={exercise.id}
                variant="outline"
                className={`w-full flex items-center justify-between border px-3 py-2 text-sm transition ${
                  isActive
                    ? 'border-primary/20 bg-primary/10 text-primary'
                    : 'border-border bg-background text-foreground hover:bg-muted'
                }`}
                onClick={() => setActiveFocusId(exercise.id)}
              >
                <span>{exercise.title}</span>
                <ChevronRight className="h-4 w-4 opacity-50" />
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function LiveExerciseMessageBoard() {
  const { activeSourceId, activeSource, activeFocusId, setActiveFocusId } =
    useWorkspace()
  const { data: messages, isLoading } = useMessages(activeSourceId ?? '')
  const isSendingMessage = useIsSendingMessage(activeSourceId)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const messageItems = Array.isArray(messages) ? messages : []
  const lastMessageId = useMemo(
    () => messageItems[messageItems.length - 1]?.id ?? null,
    [messageItems],
  )

  if (!activeSourceId) return null

  const handleSelectExercise = (exercise: Exercise) => {
    setActiveFocusId(exercise.id)
    toast.success(`Đã chuyển trọng tâm sang "${exercise.title}"`)
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [lastMessageId, isSendingMessage])

  return (
    <div className="space-y-5">
      {isLoading ? (
        <div className="rounded-2xl border border-border bg-muted/60 p-5 text-center text-sm text-muted-foreground">
          Đang tải lịch sử...
        </div>
      ) : (
        <div className="space-y-4">
          {messageItems.map((message) => {
            const isWelcomeMessage = message.message_type === 'welcome'
            const isUser = message.role === 'user'

            return (
              <div
                key={message.id}
                className={`flex items-start gap-2.5 ${
                  isUser ? 'justify-end' : ''
                }`}
              >
                {!isUser && (
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                )}

                <div
                  className={cn(
                    'rounded-2xl border px-3.5 py-3 text-sm leading-relaxed shadow-sm',
                    {
                      'max-w-[78%] border-transparent bg-primary text-primary-foreground':
                        isUser,
                      'w-full border-border bg-card': !isUser,
                    },
                  )}
                >
                  <p>{message.content}</p>

                  {!isUser && isWelcomeMessage && (
                    <div className="mt-3">
                      <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        Danh sách bài tập
                      </p>

                      <div className="space-y-1.5">
                        {activeSource?.exercises?.map((exercise) => {
                          const isActive = activeFocusId === exercise.id

                          return (
                            <Button
                              type="button"
                              key={`${message.id}-${exercise.id}`}
                              onClick={() => handleSelectExercise(exercise)}
                              variant={'outline'}
                              className={`w-full flex items-center justify-between border px-3 py-2 text-sm transition ${
                                isActive
                                  ? 'bg-primary/10 text-primary border-primary/20'
                                  : 'bg-background text-foreground border-border hover:bg-muted'
                              }`}
                            >
                              <span>{exercise.title}</span>
                              <ChevronRight className="h-4 w-4 opacity-50" />
                            </Button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {message.created_at && (
                    <p
                      className={`mt-1.5 text-[10px] ${
                        isUser
                          ? 'text-primary-foreground/70'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {new Date(message.created_at).toLocaleTimeString('vi-VN')}
                    </p>
                  )}
                </div>

                {isUser && (
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <UserRound className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            )
          })}

          {isSendingMessage ? (
            <div className="flex items-start gap-2.5">
              <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Bot className="h-3.5 w-3.5" />
              </div>

              <div className="w-full rounded-2xl border border-border bg-card px-3.5 py-3 text-sm text-muted-foreground shadow-sm">
                <p>Đang suy nghĩ...</p>
              </div>
            </div>
          ) : null}

          <div ref={bottomRef} />
        </div>
      )}
    </div>
  )
}
