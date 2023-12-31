import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { FlaskConicalIcon } from "lucide-react";
import { useState } from "react";

import { CreateTestBlockForm } from "./CreateTestBlockForm";

export const CreateTestBlockDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const closeDialog = () => setIsOpen(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="ml-4">
          <FlaskConicalIcon className="mr-2" />
          Add test block
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add a new test block</DialogTitle>
          <DialogDescription>
            Fill the form bellow and select a zip archive with your tests. Click
            add when you're done.
          </DialogDescription>
        </DialogHeader>
        <CreateTestBlockForm closeDialogCallback={closeDialog} />
      </DialogContent>
    </Dialog>
  );
};
