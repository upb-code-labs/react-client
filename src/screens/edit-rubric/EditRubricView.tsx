import { ActionButton } from "@/components/Rubric/ActionButton";
import { ObjectiveRow } from "@/components/Rubric/ObjectiveRow";
import { RubricName } from "@/components/Rubric/RubricName";
import { getRubricByUuidService } from "@/services/rubrics/get-rubric-by-uuid.service";
import { Rubric } from "@/types/entities/rubric";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export const EditRubricView = () => {
  const [_loading, setLoading] = useState(true);
  const [rubric, setRubric] = useState<Rubric | null>(null);

  const navigate = useNavigate();
  const id = useParams<{ id: string | undefined }>().id;

  const handleError = (message: string) => {
    setLoading(false);
    toast.error(message);
    navigate("/rubrics");
  };

  useEffect(() => {
    const getRubricData = async () => {
      if (!id) {
        handleError("The rubric id is not defined");
        return;
      }

      setLoading(true);
      const { success, message, rubric } = await getRubricByUuidService(id);
      if (!success) {
        handleError(message);
        return;
      }

      setRubric(rubric);
      setLoading(false);
    };

    getRubricData();
  }, []);

  if (!rubric) return null;

  return (
    <main className="mx-auto max-w-7xl space-y-4 p-4">
      <RubricName rubricName={rubric.name} rubricUUID={rubric.uuid} />
      {rubric.objectives.map((objective, oi) => (
        <ObjectiveRow objective={objective} index={oi} />
      ))}
      <ActionButton
        text="Add objective"
        onClick={() => console.log("Add objective")}
      />
    </main>
  );
};
