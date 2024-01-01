import { EditLaboratoryAction } from "@/hooks/laboratories/editLaboratoryTypes";
import {
  EditLaboratoryState,
  useEditLaboratory
} from "@/hooks/laboratories/useEditLaboratory";
import { Dispatch, ReactNode, createContext } from "react";

interface EditLaboratoryContext {
  loading: boolean;
  laboratoryState: EditLaboratoryState;
  laboratoryStateDispatcher: Dispatch<EditLaboratoryAction>;
}

const defaultValues: EditLaboratoryContext = {
  loading: false,
  laboratoryState: {
    laboratory: null
  },
  laboratoryStateDispatcher: () => {}
};

export const EditLaboratoryContext =
  createContext<EditLaboratoryContext>(defaultValues);

export const EditLaboratoryProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  const { loading, laboratoryState, laboratoryStateDispatcher } =
    useEditLaboratory();

  return (
    <EditLaboratoryContext.Provider
      value={{
        loading,
        laboratoryState,
        laboratoryStateDispatcher
      }}
    >
      {children}
    </EditLaboratoryContext.Provider>
  );
};
