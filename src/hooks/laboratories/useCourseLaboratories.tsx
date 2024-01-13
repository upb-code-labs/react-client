import { getCourseLaboratoriesService } from "@/services/laboratories/get-course-laboratories.service";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export const useCourseLaboratories = () => {
  const { courseUUID } = useParams<{ courseUUID: string }>();

  // Fetching state
  const {
    data: laboratories,
    isLoading,
    isError: isCourseLaboratoriesError,
    error: courseLaboratoriesError
  } = useQuery({
    queryKey: ["course-laboratories", courseUUID],
    queryFn: () => getCourseLaboratoriesService(courseUUID!)
  });

  return {
    isLoading,
    isError: isCourseLaboratoriesError,
    error: courseLaboratoriesError,
    laboratories
  };
};
