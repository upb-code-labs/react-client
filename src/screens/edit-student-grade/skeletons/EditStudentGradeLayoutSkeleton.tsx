import { Skeleton } from "@/components/ui/skeleton";

import { HighlightableRubricSkeleton } from "../../../components/Skeletons/HighlightableRubricSkeleton";
import { GradingSidebarSkeleton } from "./GradingSidebarSkeleton";

export const EditStudentGradeLayoutSkeleton = () => {
  return (
    <div className="col-span-3 flex flex-col gap-4">
      <div className="w-full">
        {/* Go back button */}
        <Skeleton className="h-10 w-28" />
      </div>
      <div className="max-w-[18rem]">
        <GradingSidebarSkeleton />
      </div>
      <HighlightableRubricSkeleton />
    </div>
  );
};
