import { AuthContext } from "@/context/AuthContext";
import { CourseLaboratoriesContext } from "@/context/laboratories/CourseLaboratoriesContext";
import { useContext } from "react";

import { CourseLaboratoriesTable } from "./components/CourseLaboratoriesTable";
import { CreateLaboratoryDialog } from "./dialogs/create-laboratory/CreateLaboratoryDialog";

export const CourseLaboratories = () => {
  const { user } = useContext(AuthContext);
  const { loading, laboratories } = useContext(CourseLaboratoriesContext);

  return (
    <main className="col-span-3">
      <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
        <h1 className="my-4 text-3xl font-bold">Course laboratories</h1>
        {user!.role == "teacher" && <CreateLaboratoryDialog />}
      </div>
      <div className="mt-12 md:mt-4">
        <CourseLaboratoriesTable
          loading={loading}
          laboratories={laboratories}
        />
      </div>
    </main>
  );
};
