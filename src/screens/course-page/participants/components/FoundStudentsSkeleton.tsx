import { ScrollArea } from "../../../../components/ui/scroll-area";
import { Skeleton } from "../../../../components/ui/skeleton";

export const FoundStudentsSkeleton = () => {
  return (
    <ScrollArea className="max-h-56">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton
          key={`found-student-skeleton-${i}`}
          className="mb-2 h-12 w-full"
        />
      ))}
    </ScrollArea>
  );
};
