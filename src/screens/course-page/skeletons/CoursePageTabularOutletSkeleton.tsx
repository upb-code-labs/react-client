import { GenericTableSkeleton } from "@/components/Skeletons/GenericTableSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

interface CoursePageTabularOutletSkeletonProps {
  tableColumns?: number;
  tableRows?: number;
  tableHeaders?: string[];
}

export const CoursePageTabularOutletSkeleton = ({
  tableColumns = 3,
  tableRows = 4,
  tableHeaders = []
}: CoursePageTabularOutletSkeletonProps) => {
  return (
    <div className="md:col-span-3">
      <div className="my-4 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-10 w-44" />
      </div>
      <div className="mt-12">
        <GenericTableSkeleton
          columns={tableColumns}
          rows={tableRows}
          headers={tableHeaders}
        />
      </div>
    </div>
  );
};
