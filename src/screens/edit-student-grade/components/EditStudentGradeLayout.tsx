import { HighlightableRubric } from "@/components/hightlightable-rubric/HighlightableRubric";
import { buttonVariants } from "@/components/ui/button";
import { studentGradeResponse } from "@/services/grades/get-grade-of-student-in-laboratory.service";
import { Rubric } from "@/types/entities/rubric-entities";
import { ArrowLeftIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { GradingSidebar } from "./grading-sidebar/GradingSidebar";

type editStudentGradeLayoutRequiredIds = {
  courseUUID: string;
  laboratoryUUID: string;
  studentUUID: string;
};

interface EditStudentGradeLayoutProps {
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
}: EditStudentGradeLayoutProps) => {
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
      <div className="max-w-[18rem]">
        <GradingSidebar
          laboratoryUUID={laboratoryUUID}
          studentUUID={studentUUID}
          studentGrade={studentGrade}
        />
      </div>
      <HighlightableRubric
        rubric={rubric}
        studentUUID={studentUUID}
        laboratoryUUID={laboratoryUUID}
        selectedCriteriaByObjective={selectedCriteriaByObjectiveMap}
      />
    </main>
  );
};
