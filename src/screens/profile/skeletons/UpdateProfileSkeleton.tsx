import { InputWithLabelSkeleton } from "@/components/Skeletons/InputWithLabelSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export const UpdateProfileSkeleton = () => {
  const inputs = Array.from({ length: 4 }, (_, i) => i);

  return (
    <div className="space-y-4">
      {/* First letter of the user's full name */}
      <Skeleton className="mx-auto my-4 aspect-square w-1/5" />
      {/* Form to update the information */}
      <div className="w-full space-y-4">
        {inputs.map((_, i) => (
          <InputWithLabelSkeleton key={`update-profile-input-skeleton-${i}`} />
        ))}
      </div>
      {/* Submit button */}
      <Skeleton className="h-10 w-full" />
    </div>
  );
};
