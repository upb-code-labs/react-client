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
  objectiveUUID
}: {
  objectiveUUID: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeDialog = () => setIsOpen(false);

  console.log({ objectiveUUID, isOpen });

  return (
    <Dialog open={isOpen} onOpenChange={(status) => setIsOpen(status)}>
      <DialogTrigger asChild>
        <ActionButton
          text="Add criteria"
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
