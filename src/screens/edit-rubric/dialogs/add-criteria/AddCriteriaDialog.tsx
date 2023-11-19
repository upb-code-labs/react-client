import { ActionButton } from "@/components/Rubric/ActionButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useState } from "react";

import { AddCriteriaForm } from "./AddCriteriaForm";

export const AddCriteriaDialog = ({
  objectiveUUID,
  index
}: {
  objectiveUUID: string;
  index: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeDialog = () => setIsOpen(false);

  return (
    <Dialog open={isOpen} onOpenChange={(status) => setIsOpen(status)}>
      <DialogTrigger asChild>
        <ActionButton
          text="Add criteria"
          ariaLabel={`Add criteria to objective ${index + 1}`}
          onClickCallback={() => setIsOpen(true)}
        />
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add a new criteria</DialogTitle>
          <DialogDescription>
            Enter the required information for the new criteria. Click create
            when you're done.
          </DialogDescription>
        </DialogHeader>
        <AddCriteriaForm
          objectiveUUID={objectiveUUID}
          closeDialogCallback={closeDialog}
        />
      </DialogContent>
    </Dialog>
  );
};
