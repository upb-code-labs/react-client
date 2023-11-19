import { create } from "zustand";

type EditRubricModalsStore = {
  selectedCriteriaUUID: string | undefined;
  setSelectedCriteriaUUID: (uuid: string | undefined) => void;

  isDeleteCriteriaModalOpen: boolean;
  setIsDeleteCriteriaModalOpen: (open: boolean) => void;
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
    }
  })
);
