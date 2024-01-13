import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { EditLaboratoryContext } from "@/context/laboratories/EditLaboratoryContext";
import { EditLaboratoryActionType } from "@/hooks/laboratories/editLaboratoryTypes";
import { deleteTestBlockService } from "@/services/blocks/delete-test-block.service";
import { Laboratory } from "@/types/entities/laboratory-entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, MoreVertical, Save, Trash2 } from "lucide-react";
import { RefObject, useContext } from "react";
import { toast } from "sonner";

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
  const { laboratoryStateDispatcher, laboratoryState } = useContext(
    EditLaboratoryContext
  );
  const { laboratory } = laboratoryState;

  const handleSaveTestBlock = async () => {
    formRef.current?.dispatchEvent(
      new Event("submit", {
        cancelable: true,
        bubbles: true
      })
    );
  };

  // Delete test block mutation
  const queryClient = useQueryClient();
  const { mutate: deleteTestBlockMutation } = useMutation({
    mutationFn: deleteTestBlockService,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      // Update the global laboratory state
      laboratoryStateDispatcher({
        type: EditLaboratoryActionType.DELETE_BLOCK,
        payload: {
          uuid: blockUUID
        }
      });

      // Show success message
      toast.success("The test block has been deleted successfully");

      // Update the laboratory query
      queryClient.setQueryData(
        ["laboratory", laboratory!.uuid],
        (oldData: Laboratory) => {
          return {
            ...oldData,
            blocks: oldData.blocks.filter((b) => b.uuid !== blockUUID)
          };
        }
      );
    }
  });

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
        <DropdownMenuItem onClick={() => deleteTestBlockMutation(blockUUID)}>
          <Trash2 className="mr-2 aspect-square h-5" />
          Delete block
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
