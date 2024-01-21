import { buttonVariants } from "@/components/ui/button";
import { studentGradeResponse } from "@/services/grades/get-grade-of-student-in-laboratory.service";
import { Rubric } from "@/types/entities/rubric-entities";
import { ArrowLeftIcon } from "lucide-react";
import { Suspense } from "react";
import { lazily } from "react-lazily";
import { Link } from "react-router-dom";

import { HighlightableRubricSkeleton } from "../../../components/Skeletons/HighlightableRubricSkeleton";
import { GradingSidebarSkeleton } from "../skeletons/GradingSidebarSkeleton";

const { HighlightableRubric: GradingRubric } = lazily(
  () => import("../../../components/hightlightable-rubric/HighlightableRubric")
);
const { GradingSidebar } = lazily(
  () => import("./grading-sidebar/GradingSidebar")
);

type editStudentGradeLayoutRequiredIds = {
  courseUUID: string;
  laboratoryUUID: string;
  studentUUID: string;
};

interface editStudentGradeLayoutProps {
  ids: editStudentGradeLayoutRequiredIds;
  rubric: Rubric;
  studentGrade: studentGradeResponse;
  selectedCriteriaByObjectiveMap: Record<string, string | null>;
}

export const EditStudentGradeLayout = ({
  ids: { courseUUID, laboratoryUUID, studentUUID },
  rubric,
  studentGrade,
  selectedCriteriaByObjectiveMap
}: editStudentGradeLayoutProps) => {
  return (
    <main className="col-span-3 flex flex-col gap-4">
      <div className="w-full">
        <Link
          to={`/courses/${courseUUID}/laboratories/${laboratoryUUID}/grades`}
          className={buttonVariants({ variant: "default" })}
        >
          <ArrowLeftIcon size={24} className="mr-2" /> Go back
        </Link>
      </div>
      <div className="grid w-full gap-8 md:grid-cols-5">
        <div className="md:col-span-3">
          <Suspense fallback={<HighlightableRubricSkeleton />}>
            <GradingRubric
              rubric={rubric}
              studentUUID={studentUUID!}
              laboratoryUUID={laboratoryUUID!}
              selectedCriteriaByObjective={selectedCriteriaByObjectiveMap}
            />
          </Suspense>
        </div>
        <div className="-order-1 md:order-1 md:col-span-2">
          <Suspense fallback={<GradingSidebarSkeleton />}>
            <GradingSidebar
              laboratoryUUID={laboratoryUUID!}
              studentUUID={studentUUID!}
              studentGrade={studentGrade}
            />
          </Suspense>
        </div>
      </div>
    </main>
  );
};
