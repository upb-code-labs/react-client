import { HighlightableRubric } from "@/components/hightlightable-rubric/HighlightableRubric";
import { buttonVariants } from "@/components/ui/button";
import { studentGradeResponse } from "@/services/grades/get-grade-of-student-in-laboratory.service";
import { Rubric } from "@/types/entities/rubric-entities";
import { ArrowLeftIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { MyGradeForm } from "./MyGradeForm";

type myGradeLayoutRequiredIds = {
  courseUUID: string;
  laboratoryUUID: string;
  studentUUID: string;
};

interface MyGradeLayoutProps {
  ids: myGradeLayoutRequiredIds;
  rubric: Rubric;
  studentGrade: studentGradeResponse;
  selectedCriteriaByObjectiveMap: Record<string, string | null>;
}

export const MyGradeLayout = ({
  ids: { courseUUID, laboratoryUUID, studentUUID },
  rubric,
  studentGrade,
  selectedCriteriaByObjectiveMap
}: MyGradeLayoutProps) => {
  return (
    <main className="col-span-3 flex flex-col gap-4">
      <div className="w-full">
        <Link
          to={`/courses/${courseUUID}/laboratories`}
          className={buttonVariants({ variant: "default" })}
        >
          <ArrowLeftIcon size={24} className="mr-2" /> Go back
        </Link>
      </div>
      <div className="max-w-[18rem]">
        <MyGradeForm studentGrade={studentGrade} />
      </div>
      <HighlightableRubric
        rubric={rubric}
        isInteractive={false}
        studentUUID={studentUUID}
        laboratoryUUID={laboratoryUUID}
        selectedCriteriaByObjective={selectedCriteriaByObjectiveMap}
      />
    </main>
  );
};
