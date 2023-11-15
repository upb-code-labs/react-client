import { Criteria, Objective, Rubric } from "@/types/entities/rubric";
import { create } from "zustand";

type EditRubricStore = {
  rubric: Rubric | undefined;
  setRubric: (rubric: Rubric) => void;
  addObjective: (objective: Objective) => void;
  addCriteria: (objectiveUUID: string, criteria: Criteria) => void;
};

export const useEditRubricStore = create<EditRubricStore>((set) => ({
  rubric: {} as Rubric,
  setRubric: (rubric) => set({ rubric }),
  addObjective: (objective) =>
    set((state) => {
      if (!state.rubric) return state;

      return {
        rubric: {
          ...state.rubric,
          objectives: [...state.rubric.objectives, objective]
        }
      };
    }),
  addCriteria: (objectiveUUID, criteria) =>
    set((state) => {
      if (!state.rubric) return state;

      const objectives = state.rubric.objectives.map((objective) => {
        if (objective.uuid === objectiveUUID) {
          return {
            ...objective,
            criteria: [...objective.criteria, criteria]
          };
        }

        return objective;
      });

      return {
        rubric: {
          ...state.rubric,
          objectives
        }
      };
    })
}));
