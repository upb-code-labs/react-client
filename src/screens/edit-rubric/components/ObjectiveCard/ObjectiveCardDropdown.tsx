import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useEditRubricModalsStore } from "@/stores/edit-rubric-modals-store";
import { MoreVertical, Save, Trash } from "lucide-react";
import { RefObject } from "react";

interface ObjectiveCardDropdownProps {
  objectiveUUID: string;
  objectiveIndex: number;
  submitButtonRef: RefObject<HTMLButtonElement>;
}

export const ObjectiveCardDropdown = ({
  objectiveUUID,
  objectiveIndex,
  submitButtonRef
}: ObjectiveCardDropdownProps) => {
  const { setIsDeleteObjectiveModalOpen, setSelectedObjectiveUUID } =
    useEditRubricModalsStore();

  const handleSaveChanges = () => {
    submitButtonRef.current?.click();
  };

  const handleDeleteObjective = () => {
    setSelectedObjectiveUUID(objectiveUUID);
    setIsDeleteObjectiveModalOpen(true);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="absolute right-2 top-4"
          aria-label={`Toggle options for objective ${objectiveIndex + 1}`}
        >
          <MoreVertical />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Objective Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSaveChanges}>
          <Save className="mr-2 h-4 w-4" />
          Save changes
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDeleteObjective}>
          <Trash className="mr-2 h-4 w-4" />
          Delete objective
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
