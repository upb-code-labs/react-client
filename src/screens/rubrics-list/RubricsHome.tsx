import { getTeacherRubricsService } from "@/services/rubrics/get-teacher-rubrics.service";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { RubricsTable } from "./components/RubricsTable";
import { CreateRubricDialog } from "./dialogs/CreateRubricDialog";

export const RubricsHome = () => {
  const {
    data: rubrics,
    isLoading: isRubricsLoading,
    isError: isRubricsError,
    error: rubricsError
  } = useQuery({
    queryKey: ["rubrics"],
    queryFn: getTeacherRubricsService
  });

  // Handle error state
  if (isRubricsError) {
    toast.error(rubricsError.message);
  }

  return (
    <div className="mx-auto max-w-7xl px-4">
      <div className="mt-4 flex flex-col items-start justify-between md:flex-row md:items-center">
        <h1 className="my-4 text-3xl font-bold">Your rubrics</h1>
        <CreateRubricDialog />
      </div>
      <main className="mt-8 md:mt-4">
        <RubricsTable isLoading={isRubricsLoading} rubrics={rubrics} />
      </main>
    </div>
  );
};
