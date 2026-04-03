import { memo } from 'react'
import { Bot, ChevronRight, UserRound } from 'lucide-react'

import { useWorkspace } from './workspace-context'
import { useMessages } from '#/hooks/api/useChat'
import { cn } from '#/lib/utils'
import { Button } from '../ui/button'
import { toast } from 'sonner'

function resolveExerciseTitle(
  exerciseId: string,
  exerciseLookup: Map<string, string>,
): string {
  return exerciseLookup.get(exerciseId) ?? 'Bài tập'
}

export const ExerciseMessageBoard = memo(function ExerciseMessageBoard() {
  const { activeSourceId, activeSource, activeFocusId, setActiveFocusId } =
    useWorkspace()
  const { data: messages, isLoading } = useMessages(activeSourceId ?? '')

  const messageItems = Array.isArray(messages) ? messages : []

  const exerciseLookup = new Map(
    (activeSource?.exercises ?? []).map((exercise) => [
      exercise.id,
      exercise.title,
    ]),
  )

  if (!activeSourceId) return null

  const handleSelectExercise = (exerciseId: string) => {
    setActiveFocusId(exerciseId)
    toast.success(
      `Đã chuyển trọng tâm sang "${resolveExerciseTitle(exerciseId, exerciseLookup)}"`,
    )
  }

  return (
    <div className="space-y-5">
      {isLoading ? (
        <div className="rounded-2xl border border-border bg-muted/60 p-5 text-center text-sm text-muted-foreground">
          Đang tải lịch sử...
        </div>
      ) : (
        <div className="space-y-4">
          {messageItems.map((message) => {
            const exerciseIds = message.meta?.exercise_ids ?? []
            const isWelcomeMessage =
              message.message_type === 'welcome' && exerciseIds.length > 0
            const isUser = message.role === 'user'

            return (
              <div
                key={message.id}
                className={`flex items-start gap-2.5 ${
                  isUser ? 'justify-end' : ''
                }`}
              >
                {/* BOT AVATAR */}
                {!isUser && (
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                )}

                {/* MESSAGE */}
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

                  {/* EXERCISE LIST */}
                  {!isUser && isWelcomeMessage && (
                    <div className="mt-3">
                      <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        Danh sách bài tập
                      </p>

                      <div className="space-y-1.5">
                        {exerciseIds.map((exerciseId) => {
                          const title = resolveExerciseTitle(
                            exerciseId,
                            exerciseLookup,
                          )
                          const isActive = activeFocusId === exerciseId

                          return (
                            <Button
                              type="button"
                              key={`${message.id}-${exerciseId}`}
                              onClick={() => handleSelectExercise(exerciseId)}
                              variant={'outline'}
                              className={`w-full flex items-center justify-between border px-3 py-2 text-sm transition ${
                                isActive
                                  ? 'bg-primary/10 text-primary border-primary/20'
                                  : 'bg-background text-foreground border-border hover:bg-muted'
                              }`}
                            >
                              <span>{title}</span>
                              <ChevronRight className="h-4 w-4 opacity-50" />
                            </Button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* TIME */}
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

                {/* USER AVATAR */}
                {isUser && (
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <UserRound className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
})
