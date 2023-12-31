import { EditLaboratoryContext } from "@/context/laboratories/EditLaboratoryContext";
import { EditLaboratoryActionType } from "@/hooks/laboratories/editLaboratoryTypes";
import { deleteTestBlockService } from "@/services/blocks/delete-test-block.service";
import { ArrowDown, ArrowUp, MoreVertical, Save, Trash2 } from "lucide-react";
import { RefObject, useContext } from "react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../../../../../components/ui/dropdown-menu";

interface TestBlockDropdown {
  blockUUID: string;
  blockIndex: number;
  formRef: RefObject<HTMLFormElement>;
}

export const TestBlockDropDown = ({
  blockUUID,
  blockIndex,
  formRef
}: TestBlockDropdown) => {
  const { laboratoryStateDispatcher } = useContext(EditLaboratoryContext);

  const handleSaveTestBlock = async () => {
    formRef.current?.dispatchEvent(
      new Event("submit", {
        cancelable: true,
        bubbles: true
      })
    );
  };

  const handleDeleteTestBlock = async () => {
    const { success, message } = await deleteTestBlockService(blockUUID);
    if (!success) {
      toast.error(message);
    }

    laboratoryStateDispatcher({
      type: EditLaboratoryActionType.DELETE_BLOCK,
      payload: {
        uuid: blockUUID
      }
    });
    toast.success(message);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="h-min px-2"
          aria-label={`Toggle options for block number ${blockIndex + 1}`}
        >
          <MoreVertical />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Block options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <ArrowUp className="mr-2 aspect-square h-5" />
          Move up
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ArrowDown className="mr-2 aspect-square h-5" />
          Move down
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSaveTestBlock}>
          <Save className="mr-2 aspect-square h-5" />
          Save changes
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDeleteTestBlock}>
          <Trash2 className="mr-2 aspect-square h-5" />
          Delete block
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
