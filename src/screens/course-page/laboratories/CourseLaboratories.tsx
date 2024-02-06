import { CustomError } from "@/components/CustomError";
import { AuthContext } from "@/context/AuthContext";
import { useCourseLaboratories } from "@/hooks/laboratories/useCourseLaboratories";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { CourseLaboratoriesTable } from "./components/CourseLaboratoriesTable";
import { CreateLaboratoryDialog } from "./dialogs/create-laboratory/CreateLaboratoryDialog";

export const CourseLaboratories = () => {
  // Url state
  const { courseUUID } = useParams<{ courseUUID: string }>();

  // Global user state
  const { user } = useContext(AuthContext);

  // Fetching state
  const { isLoading, laboratories, isError, error } = useCourseLaboratories();

  if (isError) {
    toast.error(error!.message);

    return (
      <div className="col-span-3">
        <CustomError
          message={error!.message}
          redirectText="Go back to course"
          redirectTo={`/courses/${courseUUID}`}
        />
      </div>
    );
  }

  return (
    <main className="col-span-3">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="my-4 text-3xl font-bold">Course laboratories</h1>
        {user!.role == "teacher" && <CreateLaboratoryDialog />}
      </div>
      <div className="mt-12 md:mt-4">
        <CourseLaboratoriesTable
          loading={isLoading}
          laboratories={laboratories}
        />
      </div>
    </main>
  );
};
