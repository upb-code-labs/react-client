import { CourseLaboratoriesTable } from "@/components/Laboratories/CourseLaboratoriesTable";
import { CourseLaboratoriesContext } from "@/context/laboratories/CourseLaboratoriesContext";
import { useSession } from "@/hooks/useSession";
import { useContext } from "react";

import { CreateLaboratoryDialog } from "./dialogs/create-laboratory/CreateLaboratoryDialog";

export const CourseLaboratories = () => {
  const { user } = useSession();
  const { loading, laboratories } = useContext(CourseLaboratoriesContext);

  return (
    <main className="col-span-3">
      <div className="mb-4 flex flex-col items-start justify-between space-y-4 md:flex-row md:items-center">
        <h1 className="text-3xl font-bold">Course laboratories</h1>
        {user?.role == "teacher" && <CreateLaboratoryDialog />}
      </div>
      <CourseLaboratoriesTable loading={loading} laboratories={laboratories} />
    </main>
  );
};
