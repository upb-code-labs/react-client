import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Objective } from "@/types/entities/rubric";

interface ObjectiveCardProps {
  objective: Objective;
  index: number;
}

export const ObjectiveCard = ({ objective, index }: ObjectiveCardProps) => {
  return (
    <article className="flex aspect-square w-1/4 flex-col gap-2 border p-4 shadow-md transition-colors hover:shadow-lg">
      <h2 className="text-xl font-bold">Objective {index + 1}</h2>
      <div className="flex flex-grow flex-col gap-2">
        <Label htmlFor={`${objective.uuid}-description`}>Description</Label>
        <Textarea
          id={`${objective.uuid}-description`}
          className="flex-grow resize-none"
          defaultValue={objective.description}
        />
      </div>
    </article>
  );
};
