import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { ActionButton } from "@/screens/edit-rubric/components/ActionButton";
import { useState } from "react";

import { AddCriteriaForm } from "./AddCriteriaForm";

interface AddCriteriaDialogProps {
  rubricUUID: string;
  objectiveUUID: string;
  objectiveIndex: number;
}

export const AddCriteriaDialog = ({
  rubricUUID,
  objectiveUUID,
  objectiveIndex
}: AddCriteriaDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeDialog = () => setIsOpen(false);

  return (
    <Dialog open={isOpen} onOpenChange={(status) => setIsOpen(status)}>
      <DialogTrigger asChild>
        <ActionButton
          text="Add criteria"
          ariaLabel={`Add criteria to objective ${objectiveIndex + 1}`}
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
          rubricUUID={rubricUUID}
          objectiveUUID={objectiveUUID}
          closeDialogCallback={closeDialog}
        />
      </DialogContent>
    </Dialog>
  );
};
