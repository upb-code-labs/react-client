import { CustomError } from "@/components/CustomError";
import { getLaboratoryByUUIDService } from "@/services/laboratories/get-laboratory-by-uuid.service";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { StudentLaboratoryBlocks } from "./components/StudentLaboratoryBlocks";
import { CompleteLaboratoryViewSkeleton } from "./skeletons/CompleteLaboratoryViewSkeleton";

export const StudentsLaboratoryView = () => {
  // Url params
  const { laboratoryUUID, courseUUID } = useParams<{
    laboratoryUUID: string;
    courseUUID: string;
  }>();

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
  if (isLoading) return <CompleteLaboratoryViewSkeleton />;

  // Handle error state
  if (isLaboratoryError) {
    toast.error(laboratoryError.message);

    return (
      <div className="col-span-3">
        <CustomError
          message={laboratoryError.message}
          redirectTo={`/courses/${courseUUID}/laboratories`}
          redirectText="Go back to laboratories"
        />
      </div>
    );
  }

  // Show an error if the laboratory is not loading but is undefined
  if (!laboratory)
    return (
      <div className="col-span-3">
        <CustomError
          message="We couldn't get the laboratory you are looking for."
          redirectTo={`/courses/${courseUUID}/laboratories`}
          redirectText="Go back to laboratories"
        />
      </div>
    );

  return (
    <main className="col-span-3">
      <StudentLaboratoryBlocks
        laboratoryUUID={laboratoryUUID!}
        blocks={laboratory.blocks}
      />
    </main>
  );
};
