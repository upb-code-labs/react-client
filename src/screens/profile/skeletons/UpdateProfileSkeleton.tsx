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
          <div
            className="flex flex-col gap-2"
            key={`update-profile-input-skeleton-${i}`}
          >
            {/* Label */}
            <Skeleton className="h-5 w-1/3" />
            {/* Input */}
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
      {/* Submit button */}
      <Skeleton className="h-10 w-full" />
    </div>
  );
};
