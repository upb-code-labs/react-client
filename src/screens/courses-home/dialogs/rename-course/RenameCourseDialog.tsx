import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { UserCoursesContext } from "@/context/courses/UserCoursesContext";
import { useContext } from "react";

import { RenameCourseForm } from "./RenameCourseForm";

export const RenameCourseDialog = () => {
  const { renameCourseDialogState, closeRenameCourseDialog } =
    useContext(UserCoursesContext);
  const { isOpen, selectedCourse } = renameCourseDialogState;
  const isOpenWithCourseSelected = isOpen && selectedCourse !== null;

  return (
    <Dialog
      open={isOpenWithCourseSelected}
      onOpenChange={(open) => {
        if (!open) closeRenameCourseDialog();
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Rename course</DialogTitle>
          <DialogDescription>
            Enter a new name for the course. Click rename when you're done.
          </DialogDescription>
        </DialogHeader>
        <RenameCourseForm />
      </DialogContent>
    </Dialog>
  );
};
