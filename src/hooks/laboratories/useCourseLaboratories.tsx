import { getCourseLaboratoriesService } from "@/services/laboratories/get-course-laboratories.service";
import { LaboratoryBaseInfo } from "@/types/entities/laboratory-entities";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import {
  courseLaboratoriesActionType,
  courseLaboratoriesReducer
} from "./courseLaboratoriesReducer";

export type courseLaboratoriesState = {
  laboratories: LaboratoryBaseInfo[];
};

export const useCourseLaboratories = () => {
  const { courseUUID } = useParams<{ courseUUID: string }>();
  const navigate = useNavigate();

  // Course laboratories state
  const [laboratoriesState, laboratoriesStateDispatcher] = useReducer(
    courseLaboratoriesReducer,
    {
      laboratories: []
    }
  );

  // Fetching state
  const {
    data: laboratories,
    status: laboratoriesStatus,
    isLoading,
    isError: isCourseLaboratoriesError,
    error: courseLaboratoriesError
  } = useQuery({
    queryKey: ["course-laboratories", courseUUID],
    queryFn: () => getCourseLaboratoriesService(courseUUID!)
  });

  // Sync dispatcher state
  useEffect(() => {
    if (laboratoriesStatus === "success" && laboratories) {
      laboratoriesStateDispatcher({
        type: courseLaboratoriesActionType.SET_LABORATORIES,
        payload: {
          laboratories: laboratories!
        }
      });
    }
  }, [laboratoriesStatus, laboratories]);

  // Handle errors
  if (isCourseLaboratoriesError) {
    toast.error(courseLaboratoriesError?.message);
    navigate(`/courses/${courseUUID}`);
  }

  return {
    loading: isLoading,
    laboratoriesState,
    laboratoriesStateDispatcher
  };
};
