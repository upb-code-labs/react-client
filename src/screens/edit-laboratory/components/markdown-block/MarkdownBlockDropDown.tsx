import { EditLaboratoryContext } from "@/context/laboratories/EditLaboratoryContext";
import { EditLaboratoryActionType } from "@/hooks/laboratories/editLaboratoryTypes";
import { swapBlocksIndexService } from "@/services/blocks/swap-blocks-index.service";
import { updateMarkdownBlockContentService } from "@/services/blocks/update-markdown-block-content.service";
import {
  Laboratory,
  MarkdownBlock
} from "@/types/entities/laboratory-entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, MoreVertical, Save, Trash2 } from "lucide-react";
import { useContext, useState } from "react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../../../../components/ui/dropdown-menu";
import { DeleteBlockDialog } from "../../dialogs/DeleteBlockDialog";

interface MarkdownBlockDropDown {
  blockUUID: string;
  blockIndex: number;
}

export const MarkdownBlockDropDown = ({
  blockUUID,
  blockIndex
}: MarkdownBlockDropDown) => {
  // Global laboratory state
  const { laboratoryState, laboratoryStateDispatcher } = useContext(
    EditLaboratoryContext
  );
  const { laboratory } = laboratoryState;

  const block = laboratory?.blocks.find(
    (b) => b.uuid === blockUUID
  ) as MarkdownBlock;

  // Delete block dialog state
  const [isDeleteBlockDialogOpen, setIsDeleteBlockDialogOpen] = useState(false);

  // Update markdown block mutation
  const queryClient = useQueryClient();
  const { mutate: updateMarkdownBlockMutation } = useMutation({
    mutationFn: updateMarkdownBlockContentService,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      // Update the laboratory query
      queryClient.setQueryData(
        ["laboratory", laboratory!.uuid],
        (oldData: Laboratory) => {
          return {
            ...oldData,
            blocks: oldData.blocks.map((b) => {
              if (b.uuid !== blockUUID) return b;

              return {
                ...block,
                content: block.content
              };
            })
          };
        }
      );

      // Show a success message
      toast.success("The markdown block has been updated successfully");
    }
  });

  // Move markdown block up mutation
  const { mutate: moveTestBlockUpMutation } = useMutation({
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
      toast.success("The markdown block has been moved up successfully");
    }
  });

  // Move markdown block down mutation
  const { mutate: moveTestBlockDownMutation } = useMutation({
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
      toast.success("The markdown block has been moved down successfully");
    }
  });

  return (
    <>
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
              moveTestBlockUpMutation({
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
              moveTestBlockDownMutation({
                first_block_uuid: blockUUID,
                second_block_uuid: laboratory!.blocks[blockIndex + 1].uuid
              })
            }
          >
            <ArrowDown className="mr-2 aspect-square h-5" />
            Move down
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              updateMarkdownBlockMutation({
                markdownBlockUUID: blockUUID,
                content: block.content
              })
            }
          >
            <Save className="mr-2 aspect-square h-5" />
            Save changes
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDeleteBlockDialogOpen(true)}>
            <Trash2 className="mr-2 aspect-square h-5" />
            Delete block
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteBlockDialog
        blockType="markdown"
        blockUUID={blockUUID}
        isDialogOpen={isDeleteBlockDialogOpen}
        setIsDialogOpen={setIsDeleteBlockDialogOpen}
      />
    </>
  );
};
