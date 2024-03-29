import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

import { CreateRubricForm } from "./CreateRubricForm";

export const CreateRubricDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const closeDialog = () => setIsOpen(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2" />
          Create rubric
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create a new rubric</DialogTitle>
          <DialogDescription>
            Enter a name for the new rubric. Click create when you're done.
          </DialogDescription>
        </DialogHeader>
        <CreateRubricForm closeDialogCallback={closeDialog} />
      </DialogContent>
    </Dialog>
  );
};
