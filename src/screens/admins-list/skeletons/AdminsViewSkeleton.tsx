import { GenericTableSkeleton } from "@/components/Skeletons/GenericTableSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export const AdminsViewSkeleton = () => {
  return (
    <div className="mx-auto max-w-7xl p-4">
      <div className="mb-4 flex flex-row flex-wrap items-center justify-between gap-4">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-10 w-40" />
      </div>
      <GenericTableSkeleton
        columns={3}
        rows={8}
        headers={["Full name", "Creation date", "Created by"]}
      />
    </div>
  );
};
