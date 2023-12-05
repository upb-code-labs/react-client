import { getLaboratoryByUUIDService } from "@/services/laboratories/get-laboratory-by-uuid.service";
import { Laboratory } from "@/types/entities/laboratory";
import { useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { editLaboratoryReducer } from "./editLaboratoryReducer";
import { EditLaboratoryActionType } from "./editLaboratoryTypes";

export type EditLaboratoryState = {
  laboratory: Laboratory | null;
};

const initialLaboratoryState: EditLaboratoryState = {
  laboratory: null
};

export const useEditLaboratory = () => {
  // State
  const [loading, setLoading] = useState(false);
  const [laboratoryState, laboratoryStateDispatcher] = useReducer(
    editLaboratoryReducer,
    initialLaboratoryState
  );

  // Navigation and url params
  const navigate = useNavigate();
  const { laboratoryUUID, courseUUID } = useParams<{
    laboratoryUUID: string;
    courseUUID: string;
  }>();

  const handleFetchingError = (message: string) => {
    toast.error(message);
    navigate(`/courses/${courseUUID}/laboratories`);
  };

  useEffect(() => {
    const fetchLaboratory = async () => {
      setLoading(true);

      const { laboratory, success, message } = await getLaboratoryByUUIDService(
        laboratoryUUID as string
      );

      if (!success) {
        handleFetchingError(message);
        return;
      }

      if (!laboratory) {
        handleFetchingError("Unable to fetch laboratory data");
        return;
      }

      laboratoryStateDispatcher({
        type: EditLaboratoryActionType.SET_LABORATORY_DATA,
        payload: {
          laboratory
        }
      });

      setLoading(false);
    };

    fetchLaboratory();
  }, []);

  return {
    loading,
    laboratoryState,
    laboratoryStateDispatcher
  };
};
