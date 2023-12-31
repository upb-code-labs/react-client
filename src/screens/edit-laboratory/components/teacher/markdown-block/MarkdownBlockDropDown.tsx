import { EditLaboratoryContext } from "@/context/laboratories/EditLaboratoryContext";
import { EditLaboratoryActionType } from "@/hooks/laboratories/editLaboratoryTypes";
import { deleteMarkdownBlockService } from "@/services/blocks/delete-markdown-block.service";
import { updateMarkdownBlockContentService } from "@/services/blocks/update-markdown-block-content.service";
import { MarkdownBlock } from "@/types/entities/laboratory-entities";
import { ArrowDown, ArrowUp, MoreVertical, Save, Trash2 } from "lucide-react";
import { useContext } from "react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../../../../../components/ui/dropdown-menu";

interface MarkdownBlockDropDown {
  blockUUID: string;
  blockIndex: number;
}

export const MarkdownBlockDropDown = ({
  blockUUID,
  blockIndex
}: MarkdownBlockDropDown) => {
  const { laboratoryState, laboratoryStateDispatcher } = useContext(
    EditLaboratoryContext
  );
  const { laboratory } = laboratoryState;

  const block = laboratory?.blocks.find(
    (b) => b.uuid === blockUUID
  ) as MarkdownBlock;

  const handleSaveMarkdownBlock = async () => {
    const { success, message } = await updateMarkdownBlockContentService({
      markdownBlockUUID: blockUUID,
      content: block.content
    });

    if (!success) {
      toast.error(message);
    } else {
      toast.success(message);
    }
  };

  const handleDeleteMarkdownBlock = async () => {
    const { success, message } = await deleteMarkdownBlockService(blockUUID);
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
        <DropdownMenuItem onClick={handleSaveMarkdownBlock}>
          <Save className="mr-2 aspect-square h-5" />
          Save changes
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDeleteMarkdownBlock}>
          <Trash2 className="mr-2 aspect-square h-5" />
          Delete block
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
