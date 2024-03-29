import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";

import { ButtonIconContainer } from "../../components/ButtonIconContainer";
import { CreateCourseForm } from "./CreateCourseForm";

export const CreateCourseDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const closeDialog = () => setIsOpen(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Visible card that acts as a button to open the dialog */}
      <DialogTrigger asChild>
        <button className="mx-auto flex aspect-square w-full max-w-xs flex-col items-center justify-center gap-4 rounded-xl border p-4 shadow-md transition-shadow hover:shadow-lg">
          <ButtonIconContainer Icon={<Plus color="#fff" size={42} />} />
          <span className="text-lg">Create a new course</span>
        </button>
      </DialogTrigger>
      {/* The dialog itself */}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create a new course</DialogTitle>
          <DialogDescription>
            Enter a name for the new course. Click create when you're done.
          </DialogDescription>
        </DialogHeader>
        <CreateCourseForm closeDialogCallback={closeDialog} />
      </DialogContent>
    </Dialog>
  );
};
