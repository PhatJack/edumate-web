import { memo, useCallback, useState } from 'react'
import { Send } from 'lucide-react'
import { useSendMessage } from '#/hooks/api/useChat'
import { useWorkspace } from './workspace-context'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

export const ExerciseMessageInput = memo(function ExerciseMessageInput() {
  const { activeSourceId, activeExercise, setActiveFocusId } = useWorkspace()
  const sendMessage = useSendMessage()
  const [message, setMessage] = useState('')

  const handleSendMessage = useCallback(async () => {
    if (!message.trim() || !activeSourceId || !activeExercise) {
      return
    }

    try {
      const response = await sendMessage.mutateAsync({
        documentId: activeSourceId,
        message: message.trim(),
        exercise_id: activeExercise.id,
      })

      if (response.exercise_id) {
        setActiveFocusId(response.exercise_id)
      }

      setMessage('')
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }, [message, activeSourceId, activeExercise, sendMessage, setActiveFocusId])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        handleSendMessage()
      }
    },
    [handleSendMessage],
  )

  return (
    <div className="flex items-end gap-2 rounded-2xl">
      <Input
        className="h-10"
        placeholder="Nhập câu hỏi để nhận gợi ý giảng bài..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={sendMessage.isPending}
      />
      <Button
        type="button"
        size="icon-lg"
        onClick={handleSendMessage}
        disabled={sendMessage.isPending || !message.trim()}
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  )
})
