import { LaboratoryBaseInfo } from "@/types/entities/laboratory";
import { useEffect, useReducer, useState } from "react";
import { useParams } from "react-router-dom";

import { courseLaboratoriesReducer } from "./courseLaboratoriesReducer";

export type courseLaboratoriesState = {
  laboratories: LaboratoryBaseInfo[];
};

export const useCourseLaboratories = () => {
  const [laboratoriesState, laboratoriesStateDispatcher] = useReducer(
    courseLaboratoriesReducer,
    {
      laboratories: []
    }
  );

  const [loading, setLoading] = useState(false);
  const { id: courseUUID } = useParams<{ id: string }>();

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
