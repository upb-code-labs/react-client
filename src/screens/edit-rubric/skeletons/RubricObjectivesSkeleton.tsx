import { RubricObjectiveRowSkeleton } from "./RubricObjectiveRowSkeleton";

interface rubricObjectivesSkeletonProps {
  rowsCount?: number;
}

export const RubricObjectivesSkeleton = ({
  rowsCount = 2
}: rubricObjectivesSkeletonProps) => {
  const rows = Array.from({ length: rowsCount }, (_, i) => i);

  return (
    <>
      {rows.map((_, i) => {
        return (
          <RubricObjectiveRowSkeleton
            rowNumber={i + 1}
            key={`rubric-objective-row-skeleton-${i + 1}`}
          />
        );
      })}
    </>
  );
};
