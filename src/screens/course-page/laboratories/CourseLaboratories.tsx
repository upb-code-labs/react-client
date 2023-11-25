import { CreateLaboratoryDialog } from "./dialogs/create-laboratory/CreateLaboratoryDialog";

export const CourseLaboratories = () => {
  return (
    <main className="col-span-3">
      <div className="mb-4 flex flex-col items-start justify-between space-y-4 md:flex-row md:items-center">
        <h1 className="text-3xl font-bold">Course laboratories</h1>
        <CreateLaboratoryDialog />
      </div>
    </main>
  );
};
