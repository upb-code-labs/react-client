import { Criteria, Objective, Rubric } from "@/types/entities/rubric";
import { create } from "zustand";

type EditRubricStore = {
  rubric: Rubric | undefined;
  setRubric: (rubric: Rubric) => void;
  resetRubric: () => void;
  setName: (name: string) => void;
  addObjective: (objective: Objective) => void;
  updateObjective: (objectiveUUID: string, description: string) => void;
  addCriteria: (objectiveUUID: string, criteria: Criteria) => void;
  updateCriteria: ({
    criteriaUUID,
    weight,
    description
  }: updateCriteriaParams) => void;
};

type updateCriteriaParams = {
  criteriaUUID: string;
  weight: number;
  description: string;
};

export const useEditRubricStore = create<EditRubricStore>((set) => ({
  // Rubric global state
  rubric: undefined,
  setRubric: (rubric) => set({ rubric }),
  resetRubric: () => set({ rubric: undefined }),

  // Rubric mutations
  setName: (name: string) =>
    set((state) => {
      if (!state.rubric) return state;

      return {
        rubric: {
          ...state.rubric,
          name
        }
      };
    }),

  // Objective mutations
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
  updateObjective: (uuid, description) => {
    set((state) => {
      if (!state.rubric) return state;

      const objectives = state.rubric.objectives.map((objective) => {
        if (objective.uuid === uuid) {
          return {
            ...objective,
            description
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
    });
  },

  // Criteria mutations
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
    }),
  updateCriteria: ({
    criteriaUUID,
    weight,
    description
  }: updateCriteriaParams) => {
    set((state) => {
      if (!state.rubric) return state;

      const objectives = state.rubric.objectives.map((objective) => {
        const criteria = objective.criteria.map((criteria) => {
          if (criteria.uuid === criteriaUUID) {
            return {
              ...criteria,
              weight,
              description
            };
          }

          return criteria;
        });

        return {
          ...objective,
          criteria
        };
      });

      return {
        rubric: {
          ...state.rubric,
          objectives
        }
      };
    });
  }
}));
