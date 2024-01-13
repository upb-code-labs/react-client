import { LaboratoryBlockSkeleton } from "@/components/Skeletons/LaboratoryBlockSkeleton";
import { getLaboratoryByUUIDService } from "@/services/laboratories/get-laboratory-by-uuid.service";
import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { lazily } from "react-lazily";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const { StudentLaboratoryBlocks } = lazily(
  () => import("./components/StudentLaboratoryBlocks")
);

export const StudentsLaboratoryView = () => {
  // Url params
  const { laboratoryUUID, courseUUID } = useParams<{
    laboratoryUUID: string;
    courseUUID: string;
  }>();

  // Navigation state
  const navigate = useNavigate();

  // Fetching state
  const {
    data: laboratory,
    isLoading,
    isError: isLaboratoryError,
    error: laboratoryError
  } = useQuery({
    queryKey: ["laboratory", laboratoryUUID],
    queryFn: () => getLaboratoryByUUIDService(laboratoryUUID!)
  });

  // Handle loading state
  if (isLoading) {
    return (
      <div className="col-span-3">
        {Array.from({ length: 3 }).map((_, index) => {
          return <LaboratoryBlockSkeleton key={`laboratory-block-${index}`} />;
        })}
      </div>
    );
  }

  // Handle error state
  if (isLaboratoryError) {
    toast.error(laboratoryError.message);
    navigate(`/courses/${courseUUID}/laboratories`);
    return;
  }

  // TODO: Display an error component if its not loading but there is no laboratory
  if (!laboratory) return null;

  return (
    <main className="col-span-3">
      <Suspense
        fallback={
          <>
            {laboratory.blocks.map((block) => {
              return (
                <LaboratoryBlockSkeleton
                  key={`laboratory-block-${block.uuid}`}
                />
              );
            })}
          </>
        }
      >
        <StudentLaboratoryBlocks blocks={laboratory.blocks} />
      </Suspense>
    </main>
  );
};
