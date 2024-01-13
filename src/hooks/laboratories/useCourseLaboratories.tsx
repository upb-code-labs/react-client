import { getCourseLaboratoriesService } from "@/services/laboratories/get-course-laboratories.service";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export const useCourseLaboratories = () => {
  const { courseUUID } = useParams<{ courseUUID: string }>();
  const navigate = useNavigate();

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

  // Handle errors
  if (isCourseLaboratoriesError) {
    toast.error(courseLaboratoriesError?.message);
    navigate(`/courses/${courseUUID}`);
  }

  return {
    loading: isLoading,
    laboratories
  };
};
