import { RubricObjectivesSkeleton } from "@/screens/edit-rubric/skeletons/RubricObjectivesSkeleton";

export const HighlightableRubricSkeleton = () => {
  return (
    <div className="flex max-w-[calc(100vw-2rem)] flex-col gap-4 md:col-span-3">
      {/* rubric skeleton */}
      <RubricObjectivesSkeleton />
    </div>
  );
};
