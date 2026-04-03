import { memo, useCallback } from 'react'
import { BookOpen } from 'lucide-react'
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
      <SheetContent side="right" className="gap-0 overflow-y-auto p-0 sm:max-w-[380px]">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle className="flex items-center gap-2 text-[30px] font-bold">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="text-base font-bold">Quản lý bài tập</span>
          </SheetTitle>
        </SheetHeader>

        {activeExercise ? (
          <div className="px-5 py-4 space-y-6">
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
