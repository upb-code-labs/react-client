import { RubricObjectiveRowSkeleton } from "./RubricObjectiveRowSkeleton";

export const RubricObjectivesSkeleton = () => {
  const rows = Array.from({ length: 2 }, (_, i) => i);

  return (
    <>
      {rows.map((_, i) => {
        return (
          <RubricObjectiveRowSkeleton
            rowNumber={i + 1}
            key={`skeleton-${i + 1}`}
          />
        );
      })}
    </>
  );
};
