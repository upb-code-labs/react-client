import { GenericTableSkeleton } from "@/components/Skeletons/GenericTableSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export const RubricsHomeSkeleton = () => {
  return (
    <div className="mx-auto max-w-7xl px-4">
      <div className="my-4 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-10 w-44" />
      </div>
      <div className="mt-8">
        <GenericTableSkeleton
          columns={2}
          rows={4}
          headers={["Name", "Options"]}
        />
      </div>
    </div>
  );
};
