import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { ActionButton } from "@/screens/edit-rubric/components/ActionButton";
import { useEditRubricStore } from "@/stores/edit-rubric-store";
import { useState } from "react";

import { AddObjectiveForm } from "./AddObjectiveForm";

export const AddObjectiveDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const closeDialog = () => setIsOpen(false);

  const { rubric } = useEditRubricStore();
  if (!rubric) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(status) => setIsOpen(status)}>
      <DialogTrigger asChild>
        <ActionButton
          text="Add objective"
          onClickCallback={() => setIsOpen(true)}
        />
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add a new objective</DialogTitle>
          <DialogDescription>
            Enter a description for the new objective. Click create when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <AddObjectiveForm
          rubricUUID={rubric?.uuid}
          closeDialogCallback={closeDialog}
        />
      </DialogContent>
    </Dialog>
  );
};
