import { ArrowDown, ArrowUp, MoreVertical, Save, Trash2 } from "lucide-react";
import { RefObject } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../../../../../components/ui/dropdown-menu";

interface TestBlockDropdown {
  blockIndex: number;
  formRef: RefObject<HTMLFormElement>;
}

export const TestBlockDropDown = ({
  formRef,
  blockIndex
}: TestBlockDropdown) => {
  const handleSaveTestBlock = async () => {
    formRef.current?.dispatchEvent(
      new Event("submit", {
        cancelable: true,
        bubbles: true
      })
    );
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
        <DropdownMenuItem>
          <Trash2 className="mr-2 aspect-square h-5" />
          Delete block
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
