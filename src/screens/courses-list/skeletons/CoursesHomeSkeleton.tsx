import { GridContainer } from "@/components/GridContainer";
import { Skeleton } from "@/components/ui/skeleton";

import { CourseCardSkeleton } from "../components/CourseCardSkeleton";

export const CoursesHomeSkeleton = () => {
  const visibleCoursesIndexes = Array.from({ length: 6 }).map((_, i) => i);

  return (
    <div className="mx-auto flex max-w-7xl flex-col p-4">
      <div className="my-4 space-y-4">
        <Skeleton className="h-6 w-24" />
        <GridContainer>
          {visibleCoursesIndexes.map((i) => (
            <CourseCardSkeleton key={`course-skeleton-${i}`} />
          ))}
        </GridContainer>
      </div>
    </div>
  );
};
