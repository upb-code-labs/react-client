import { getCourseLaboratoriesService } from "@/services/laboratories/get-course-laboratories.service";
import { LaboratoryBaseInfo } from "@/types/entities/laboratory-entities";
import { useEffect, useReducer, useState } from "react";
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
  const [laboratoriesState, laboratoriesStateDispatcher] = useReducer(
    courseLaboratoriesReducer,
    {
      laboratories: []
    }
  );

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { courseUUID } = useParams<{ courseUUID: string }>();

  useEffect(() => {
    const getLaboratories = async () => {
      setLoading(true);

      const { success, message, laboratories } =
        await getCourseLaboratoriesService(courseUUID as string);
      if (!success) {
        toast.error(message);
        navigate(`/courses/${courseUUID}`);
        return;
      }

      laboratoriesStateDispatcher({
        type: courseLaboratoriesActionType.SET_LABORATORIES,
        payload: {
          laboratories
        }
      });
      setLoading(false);
    };

    getLaboratories();
  }, []);

  return {
    loading,
    laboratoriesState,
    laboratoriesStateDispatcher
  };
};
