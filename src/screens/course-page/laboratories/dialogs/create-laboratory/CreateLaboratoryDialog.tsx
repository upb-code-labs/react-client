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

import { CreateLaboratoryForm } from "./CreateLaboratoryForm";

export const CreateLaboratoryDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const closeDialog = () => setIsOpen(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2" /> Create Laboratory
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create a new laboratory</DialogTitle>
          <DialogDescription>
            Enter the laboratory details below. Click create when you're done.
          </DialogDescription>
        </DialogHeader>
        <CreateLaboratoryForm closeDialogCallback={closeDialog} />
      </DialogContent>
    </Dialog>
  );
};
