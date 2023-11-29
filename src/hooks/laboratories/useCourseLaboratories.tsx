import { LaboratoryBaseInfo } from "@/types/entities/laboratory";
import { useEffect, useReducer, useState } from "react";

import { courseLaboratoriesReducer } from "./courseLaboratoriesReducer";

export type courseLaboratoriesState = {
  laboratories: LaboratoryBaseInfo[];
};

interface useCourseLaboratoriesProps {
  courseUUID: string;
}

export const useCourseLaboratories = ({
  courseUUID
}: useCourseLaboratoriesProps) => {
  const [laboratoriesState, laboratoriesStateDispatcher] = useReducer(
    courseLaboratoriesReducer,
    {
      laboratories: []
    }
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getLaboratories = async () => {
      setLoading(true);
      console.log(`Getting laboratories for course ${courseUUID}`);
      setLoading(false);
    };

    getLaboratories();
  }, []);

  return {
    loading,
    laboratoriesState,
    laboratoriesStateDispatcher
  };
};
