import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { LogIn } from "lucide-react";
import { useState } from "react";

import { ButtonIconContainer } from "../../components/ButtonIconContainer";
import { JoinCourseForm } from "./JoinCourseForm";

export const JoinCourseDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const closeDialog = () => setIsOpen(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Visible card that acts as a button to open the dialog */}
      <DialogTrigger asChild>
        <button className="mx-auto flex aspect-square w-full max-w-xs flex-col items-center justify-center gap-4 rounded-xl border p-4 shadow-md transition-shadow hover:shadow-lg">
          <ButtonIconContainer Icon={<LogIn color="#fff" size={42} />} />
          <span className="text-lg">Join with an invitation code</span>
        </button>
      </DialogTrigger>
      {/* The dialog itself */}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Join a course</DialogTitle>
          <DialogDescription>
            Enter the invitation code to join a course. Click join when you are
            done
          </DialogDescription>
        </DialogHeader>
        <JoinCourseForm closeDialogCallback={closeDialog} />
      </DialogContent>
    </Dialog>
  );
};
