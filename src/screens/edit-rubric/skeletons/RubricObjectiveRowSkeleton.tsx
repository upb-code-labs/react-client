import { Skeleton } from "@/components/ui/skeleton";

const cols = Array.from({ length: 4 }, (_, i) => i);

export const RubricObjectiveRowSkeleton = ({
  rowNumber
}: {
  rowNumber: number;
}) => {
  return (
    <div className="flex gap-4 overflow-x-auto">
      {cols.map((_, j) => {
        return (
          <Skeleton
            className="aspect-square w-full max-w-[18rem] flex-shrink-0 sm:w-72"
            key={`skeleton-${rowNumber}-${j + 1}`}
          />
        );
      })}
    </div>
  );
};
