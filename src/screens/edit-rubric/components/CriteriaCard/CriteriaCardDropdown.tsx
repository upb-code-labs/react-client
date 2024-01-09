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

interface CriteriaCardDropdownProps {
  criteriaIndex: number;
  criteriaUUID: string;
  objectiveIndex: number;
  submitButtonRef: RefObject<HTMLButtonElement>;
}

export const CriteriaCardDropdown = ({
  criteriaIndex,
  criteriaUUID,
  objectiveIndex,
  submitButtonRef
}: CriteriaCardDropdownProps) => {
  const { setIsDeleteCriteriaModalOpen, setSelectedCriteriaUUID } =
    useEditRubricModalsStore();

  const handleSaveChanges = () => {
    submitButtonRef.current?.click();
  };

  const handleDeleteCriteria = () => {
    setSelectedCriteriaUUID(criteriaUUID);
    setIsDeleteCriteriaModalOpen(true);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="absolute right-2 top-4"
          aria-label={`Toggle options for criteria ${
            criteriaIndex + 1
          } of objective ${objectiveIndex + 1}`}
        >
          <MoreVertical />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Criteria Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSaveChanges}>
          <Save className="mr-2 h-4 w-4" />
          Save changes
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDeleteCriteria}>
          <Trash className="mr-2 h-4 w-4" />
          Delete criteria
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
