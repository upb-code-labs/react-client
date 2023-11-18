import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Save } from "lucide-react";
import { RefObject } from "react";

interface ObjectiveCardDropdownProps {
  objectiveIndex: number;
  submitButtonRef: RefObject<HTMLButtonElement>;
}

export const ObjectiveCardDropdown = ({
  objectiveIndex,
  submitButtonRef
}: ObjectiveCardDropdownProps) => {
  const handleSaveChanges = () => {
    submitButtonRef.current?.click();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="absolute right-2 top-4"
          aria-label={`Toggle objective options for objective ${
            objectiveIndex + 1
          }`}
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
