import { EditLaboratoryAction } from "@/hooks/laboratories/editLaboratoryTypes";
import {
  EditLaboratoryState,
  useEditLaboratory
} from "@/hooks/laboratories/useEditLaboratory";
import { Dispatch, ReactNode, createContext } from "react";

interface EditLaboratoryContext {
  loading: boolean;
  isError: boolean;
  error: Error | null;
  laboratoryState: EditLaboratoryState;
  laboratoryStateDispatcher: Dispatch<EditLaboratoryAction>;
}

const defaultValues: EditLaboratoryContext = {
  loading: false,
  isError: false,
  error: null,
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
  const {
    loading,
    isError,
    error,
    laboratoryState,
    laboratoryStateDispatcher
  } = useEditLaboratory();

  return (
    <EditLaboratoryContext.Provider
      value={{
        loading,
        isError,
        error,
        laboratoryState,
        laboratoryStateDispatcher
      }}
    >
      {children}
    </EditLaboratoryContext.Provider>
  );
};
