import { InputWithLabelSkeleton } from "@/components/Skeletons/InputWithLabelSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

interface GenericFormSkeletonProps {
  inputCount: number;
}

export const GenericFormSkeleton = ({
  inputCount
}: GenericFormSkeletonProps) => {
  const inputsIndex = [...Array(inputCount)].map((_, index) => index);

  return (
    <div className="mx-auto my-4 max-w-md space-y-4 border p-4 shadow-sm">
      {/* Title */}
      <Skeleton className="mx-auto h-9 w-3/4" />
      {inputsIndex.map((index) => (
        <InputWithLabelSkeleton key={`input-group-skeleton-${index}`} />
      ))}
      {/* Submit button */}
      <Skeleton className="h-10 w-full" />
    </div>
  );
};
