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

interface myGradeLayoutProps {
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
}: myGradeLayoutProps) => {
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
      <div className="grid w-full gap-8 md:grid-cols-5">
        <div className="md:col-span-3">
          <HighlightableRubric
            rubric={rubric}
            isInteractive={false}
            studentUUID={studentUUID!}
            laboratoryUUID={laboratoryUUID!}
            selectedCriteriaByObjective={selectedCriteriaByObjectiveMap}
          />
        </div>
        <div className="-order-1 md:order-1 md:col-span-2">
          <MyGradeForm studentGrade={studentGrade} />
        </div>
      </div>
    </main>
  );
};
