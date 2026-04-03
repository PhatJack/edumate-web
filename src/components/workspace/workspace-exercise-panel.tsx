import { memo, useCallback } from 'react'
import { BookOpen, X } from 'lucide-react'

import { useWorkspace } from './workspace-context'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '#/components/ui/sheet'
import { ExerciseDetailsSection } from './exercise-details-section'
import { ReferenceSolutionSection } from './reference-solution-section'
import { ExtendedPracticeSection } from './extended-practice-section'
import { ScrollArea } from '../ui/scroll-area'
import { Button } from '../ui/button'
import { useIsMobile } from '#/hooks/use-mobile'

export const WorkspaceExercisePanel = memo(function WorkspaceExercisePanel() {
  const { isExercisePanelOpen, setIsExercisePanelOpen, activeExercise } =
    useWorkspace()
  const isMobile = useIsMobile()

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsExercisePanelOpen(open)
    },
    [setIsExercisePanelOpen],
  )

  const handleClose = useCallback(() => {
    setIsExercisePanelOpen(false)
  }, [setIsExercisePanelOpen])

  if (!isMobile) {
    if (!isExercisePanelOpen) {
      return null
    }

    return (
      <aside
        className="relative z-30 flex h-full w-full max-w-95 flex-none flex-col border-l border-border bg-background"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="text-base font-bold">Quản lý bài tập</span>
          </div>

          <Button type="button" size="icon" variant="ghost" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="min-h-0 flex-1">
          {activeExercise ? (
            <div className="space-y-6 px-5 py-4">
              <ExerciseDetailsSection />
              <ReferenceSolutionSection />
              <ExtendedPracticeSection />
            </div>
          ) : (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                Vui lòng chọn một bài tập để quản lý
              </p>
            </div>
          )}
        </ScrollArea>
      </aside>
    )
  }

  return (
    <Sheet open={isExercisePanelOpen} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="gap-0 min-h-0 p-0 sm:max-w-95">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle className="flex items-center gap-2 text-base font-bold">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="text-base font-bold">Quản lý bài tập</span>
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="min-h-0 flex-1">
          {activeExercise ? (
            <div className="space-y-6 px-5 py-4">
              <ExerciseDetailsSection />
              <ReferenceSolutionSection />
              <ExtendedPracticeSection />
            </div>
          ) : (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                Vui lòng chọn một bài tập để quản lý
              </p>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
})
