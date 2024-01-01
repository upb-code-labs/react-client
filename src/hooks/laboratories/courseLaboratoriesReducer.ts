import { LaboratoryBaseInfo } from "@/types/entities/laboratory-entities";

import { courseLaboratoriesState } from "./useCourseLaboratories";

export enum courseLaboratoriesActionType {
  SET_LABORATORIES = "SET_LABORATORIES",
  ADD_LABORATORY = "ADD_LABORATORY"
}

export type courseLaboratoriesActions =
  | {
      type: courseLaboratoriesActionType.SET_LABORATORIES;
      payload: {
        laboratories: LaboratoryBaseInfo[];
      };
    }
  | {
      type: courseLaboratoriesActionType.ADD_LABORATORY;
      payload: {
        laboratory: LaboratoryBaseInfo;
      };
    };

export function courseLaboratoriesReducer(
  state: courseLaboratoriesState,
  action: courseLaboratoriesActions
) {
  switch (action.type) {
    case courseLaboratoriesActionType.SET_LABORATORIES:
      return {
        laboratories: action.payload.laboratories
      };
    case courseLaboratoriesActionType.ADD_LABORATORY:
      return {
        ...state,
        laboratories: [...state.laboratories, action.payload.laboratory]
      };
    default:
      return state;
  }
}
