import { memo } from 'react'
import { useWorkspace } from './workspace-context'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { cn } from '#/lib/utils'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

export const ExerciseSelector = memo(function ExerciseSelector() {
  const { activeSource, activeFocusId, setActiveFocusId } = useWorkspace()

  return (
    <div id="tour-focus-target" className="mb-3">
      <div
        className={cn(
          'flex justify-between items-center',
          activeSource?.kind === 'pdf' ? 'gap-2' : '',
        )}
      >
        {activeSource?.kind === 'pdf' && (
          <div className="flex flex-col gap-2 w-1/5">
            <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Quét trang PDF
            </label>
            <div className="flex gap-2 items-center">
              <Input type="number" />
              <Button type="button">Quét</Button>
            </div>
          </div>
        )}
        <div
          className={cn(
            'flex flex-col gap-2',
            activeSource?.kind === 'pdf' ? 'w-4/5' : 'w-full',
          )}
        >
          <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Chọn bài tập mục tiêu
          </label>
          <Select value={activeFocusId ?? ''} onValueChange={setActiveFocusId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn một bài tập..." />
            </SelectTrigger>
            <SelectContent>
              {activeSource?.exercises.map((exercise) => (
                <SelectItem key={exercise.id} value={exercise.id}>
                  {exercise.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
})
