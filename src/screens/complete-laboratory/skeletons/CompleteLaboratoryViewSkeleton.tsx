import { LaboratoryBlockSkeleton } from "@/components/Skeletons/LaboratoryBlockSkeleton";

export const CompleteLaboratoryViewSkeleton = () => {
  const blocksIndexes = Array.from({ length: 3 });

  return (
    <div className="col-span-3">
      {blocksIndexes.map((_, index) => {
        return (
          <LaboratoryBlockSkeleton key={`laboratory-block-skeleton-${index}`} />
        );
      })}
    </div>
  );
};
