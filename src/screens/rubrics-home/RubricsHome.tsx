import { getTeacherRubricsService } from "@/services/rubrics/get-teacher-rubrics.service";
import { CreatedRubric } from "@/types/entities/rubric";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { RubricsTable } from "./components/RubricsTable";
import { CreateRubricDialog } from "./dialogs/CreateRubricDialog";

export const RubricsHome = () => {
  const [loading, setLoading] = useState(true);
  const [rubrics, setRubrics] = useState<CreatedRubric[]>([]);

  useEffect(() => {
    getRubrics();
  }, []);

  const getRubrics = async () => {
    setLoading(true);
    const { success, ...response } = await getTeacherRubricsService();

    if (!success) {
      toast.error(response.message);
      setLoading(false);
      return;
    }

    setRubrics(response.rubrics);
    setLoading(false);
  };

  const addRubric = (rubric: CreatedRubric) => {
    setRubrics((prev) => [...prev, rubric]);
  };

  return (
    <div className="mx-auto max-w-7xl px-4">
      <div className="mb-2 flex flex-col items-start justify-between md:flex-row md:items-center">
        <h1 className="my-4 text-3xl font-bold">Your rubrics</h1>
        <CreateRubricDialog addRubricCallback={addRubric} />
      </div>
      <main>
        <RubricsTable isLoading={loading} rubrics={rubrics} />
      </main>
    </div>
  );
};
