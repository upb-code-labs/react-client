import { create } from "zustand";

type EditRubricModalsStore = {
  selectedCriteriaUUID: string | undefined;
  setSelectedCriteriaUUID: (uuid: string | undefined) => void;
  isDeleteCriteriaModalOpen: boolean;
  setIsDeleteCriteriaModalOpen: (open: boolean) => void;

  selectedObjectiveUUID: string | undefined;
  setSelectedObjectiveUUID: (uuid: string | undefined) => void;
  isDeleteObjectiveModalOpen: boolean;
  setIsDeleteObjectiveModalOpen: (open: boolean) => void;
};

export const useEditRubricModalsStore = create<EditRubricModalsStore>(
  (set) => ({
    selectedCriteriaUUID: undefined,
    setSelectedCriteriaUUID: (uuid: string | undefined) => {
      return set({ selectedCriteriaUUID: uuid });
    },

    isDeleteCriteriaModalOpen: false,
    setIsDeleteCriteriaModalOpen: (open: boolean) => {
      return set({ isDeleteCriteriaModalOpen: open });
    },

    selectedObjectiveUUID: undefined,
    setSelectedObjectiveUUID: (uuid: string | undefined) => {
      return set({ selectedObjectiveUUID: uuid });
    },

    isDeleteObjectiveModalOpen: false,
    setIsDeleteObjectiveModalOpen: (open: boolean) => {
      return set({ isDeleteObjectiveModalOpen: open });
    }
  })
);
