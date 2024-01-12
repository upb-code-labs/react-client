import { getLaboratoryByUUIDNewService } from "@/services/laboratories/get-laboratory-by-uuid.service";
import { Laboratory } from "@/types/entities/laboratory-entities";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useReducer } from "react";
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
  // Navigation and url params
  const navigate = useNavigate();
  const { laboratoryUUID, courseUUID } = useParams<{
    laboratoryUUID: string;
    courseUUID: string;
  }>();

  // State
  const [laboratoryState, laboratoryStateDispatcher] = useReducer(
    editLaboratoryReducer,
    initialLaboratoryState
  );

  // Fetching state
  const {
    data: laboratory,
    status: laboratoryStatus,
    isLoading,
    isError: isLaboratoryError,
    error: laboratoryError
  } = useQuery({
    queryKey: ["laboratory", laboratoryUUID],
    queryFn: () => getLaboratoryByUUIDNewService(laboratoryUUID!)
  });

  // Sync dispatcher with the fetched data
  useEffect(() => {
    if (laboratoryStatus === "success" && laboratory) {
      laboratoryStateDispatcher({
        type: EditLaboratoryActionType.SET_LABORATORY_DATA,
        payload: {
          laboratory
        }
      });
    }
  }, [laboratoryStatus, laboratory]);

  // Handle fetching error
  const handleFetchingError = (message: string) => {
    toast.error(message);
    navigate(`/courses/${courseUUID}/laboratories`);
  };

  if (isLaboratoryError) {
    handleFetchingError(
      laboratoryError?.message || "Unable to fetch laboratory data"
    );
  }

  return {
    loading: isLoading,
    laboratoryState,
    laboratoryStateDispatcher
  };
};
