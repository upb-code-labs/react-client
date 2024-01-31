import { Skeleton } from "@/components/ui/skeleton";

import { StudentSubmissionSummaryCardSkeleton } from "./StudentSubmissionSummaryCardSkeleton";

const submissionCardsToRender = Array.from({ length: 3 }, (_, index) => index);

export const StudentSubmissionsSkeleton = () => {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-7 w-1/3" />
      <Skeleton className="h-12 w-full" />
      <ul className="flex flex-col gap-4">
        {submissionCardsToRender.map((_, index) => (
          <li key={`student-submission-skeleton-${index}`}>
            <StudentSubmissionSummaryCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  );
};
