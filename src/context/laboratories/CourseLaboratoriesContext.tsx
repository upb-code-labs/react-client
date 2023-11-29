import { courseLaboratoriesActions } from "@/hooks/laboratories/courseLaboratoriesReducer";
import { useCourseLaboratories } from "@/hooks/laboratories/useCourseLaboratories";
import { LaboratoryBaseInfo } from "@/types/entities/laboratory";
import { Dispatch, createContext } from "react";

interface courseLaboratoriesContext {
  loading: boolean;
  laboratories: LaboratoryBaseInfo[];
  laboratoriesDispatcher: Dispatch<courseLaboratoriesActions>;
}

const defaultValues: courseLaboratoriesContext = {
  loading: false,
  laboratories: [],
  laboratoriesDispatcher: () => {}
};

export const CourseLaboratoriesContext =
  createContext<courseLaboratoriesContext>(defaultValues);

export const CourseLaboratoriesProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { loading, laboratoriesState, laboratoriesStateDispatcher } =
    useCourseLaboratories();

  const { laboratories } = laboratoriesState;

  return (
    <CourseLaboratoriesContext.Provider
      value={{
        loading,
        laboratories,
        laboratoriesDispatcher: laboratoriesStateDispatcher
      }}
    >
      {children}
    </CourseLaboratoriesContext.Provider>
  );
};
