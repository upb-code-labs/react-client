import { Objective, Rubric } from "@/types/entities/rubric";
import { create } from "zustand";

type EditRubricStore = {
  rubric: Rubric;
  setRubric: (rubric: Rubric) => void;
  addObjective: (objective: Objective) => void;
};

export const useEditRubricStore = create<EditRubricStore>((set) => ({
  rubric: {} as Rubric,
  setRubric: (rubric) => set({ rubric }),
  addObjective: (objective) =>
    set((state) => ({
      rubric: {
        ...state.rubric,
        objectives: [...state.rubric.objectives, objective]
      }
    }))
}));
