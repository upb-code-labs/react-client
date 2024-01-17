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
import { swapBlocksIndexService } from "@/services/blocks/swap-blocks-index.service";
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

  // Move test block up mutation
  const { mutate: moteTestBlockUpMutation } = useMutation({
    mutationFn: swapBlocksIndexService,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess() {
      const thisBlock = laboratory!.blocks[blockIndex];
      const prevBlock = laboratory!.blocks[blockIndex - 1];

      // Update the global laboratory state
      laboratoryStateDispatcher({
        type: EditLaboratoryActionType.SWAP_BLOCKS,
        payload: {
          uuid1: thisBlock.uuid,
          uuid2: prevBlock.uuid
        }
      });

      // Update the laboratory query
      queryClient.setQueryData(
        ["laboratory", laboratory!.uuid],
        (oldData: Laboratory) => {
          return {
            ...oldData,
            blocks: oldData.blocks.map((b) => {
              if (b.uuid === thisBlock.uuid) return prevBlock;
              if (b.uuid === prevBlock.uuid) return thisBlock;
              return b;
            })
          };
        }
      );

      // Show success message
      toast.success("The test block has been moved up successfully");
    }
  });

  // Move test block down mutation
  const { mutate: moteTestBlockDownMutation } = useMutation({
    mutationFn: swapBlocksIndexService,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess() {
      const thisBlock = laboratory!.blocks[blockIndex];
      const nextBlock = laboratory!.blocks[blockIndex + 1];

      // Update the global laboratory state
      laboratoryStateDispatcher({
        type: EditLaboratoryActionType.SWAP_BLOCKS,
        payload: {
          uuid1: thisBlock.uuid,
          uuid2: nextBlock.uuid
        }
      });

      // Update the laboratory query
      queryClient.setQueryData(
        ["laboratory", laboratory!.uuid],
        (oldData: Laboratory) => {
          return {
            ...oldData,
            blocks: oldData.blocks.map((b) => {
              if (b.uuid === thisBlock.uuid) return nextBlock;
              if (b.uuid === nextBlock.uuid) return thisBlock;
              return b;
            })
          };
        }
      );

      // Show success message
      toast.success("The test block has been moved down successfully");
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
        <DropdownMenuItem
          disabled={blockIndex === 0}
          onClick={() =>
            moteTestBlockUpMutation({
              first_block_uuid: laboratory!.blocks[blockIndex - 1].uuid,
              second_block_uuid: blockUUID
            })
          }
        >
          <ArrowUp className="mr-2 aspect-square h-5" />
          Move up
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={blockIndex === laboratory!.blocks.length - 1}
          onClick={() =>
            moteTestBlockDownMutation({
              first_block_uuid: blockUUID,
              second_block_uuid: laboratory!.blocks[blockIndex + 1].uuid
            })
          }
        >
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
