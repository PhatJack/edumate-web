import { memo, useCallback } from 'react'
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

export const WorkspaceExercisePanel = memo(function WorkspaceExercisePanel() {
  const { isExercisePanelOpen, setIsExercisePanelOpen, activeExercise } =
    useWorkspace()

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsExercisePanelOpen(open)
    },
    [setIsExercisePanelOpen],
  )

  return (
    <Sheet open={isExercisePanelOpen} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Quản lý bài tập</SheetTitle>
        </SheetHeader>

        {activeExercise ? (
          <div className="px-4 space-y-4">
            <ExerciseDetailsSection />
            <ReferenceSolutionSection />
            <ExtendedPracticeSection />
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              Vui lòng chọn một bài tập để quản lý
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
})
