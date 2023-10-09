import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";

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
