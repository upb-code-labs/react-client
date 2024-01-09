import { RubricNameSkeleton } from "./RubricNameSkeleton";
import { RubricObjectivesSkeleton } from "./RubricObjectivesSkeleton";

export const RubricSkeleton = () => {
  return (
    <div className="mx-auto max-w-7xl space-y-4 p-4">
      <RubricNameSkeleton />
      <RubricObjectivesSkeleton />
    </div>
  );
};
