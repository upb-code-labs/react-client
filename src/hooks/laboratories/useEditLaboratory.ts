import { getLaboratoryByUUIDService } from "@/services/laboratories/get-laboratory-by-uuid.service";
import { Laboratory } from "@/types/entities/laboratory-entities";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";

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
  const { laboratoryUUID } = useParams<{
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
    isError,
    error
  } = useQuery({
    queryKey: ["laboratory", laboratoryUUID],
    queryFn: () => getLaboratoryByUUIDService(laboratoryUUID!)
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

  return {
    loading: isLoading,
    isError,
    error,
    laboratoryState,
    laboratoryStateDispatcher
  };
};
