import { Skeleton } from "../ui/skeleton";

export const RubricSkeleton = () => {
  const rows = [
    Array.from({ length: 4 }, (_, i) => i),
    Array.from({ length: 4 }, (_, i) => i)
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-4">
      {rows.map((cols, i) => {
        return (
          <div className="flex gap-4 overflow-x-auto">
            {cols.map((_, j) => {
              return (
                <Skeleton
                  className="aspect-square w-full max-w-[18rem] flex-shrink-0 sm:w-72"
                  key={`skeleton-${i}-${j}`}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
