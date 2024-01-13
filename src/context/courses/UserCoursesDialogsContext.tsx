import { Course } from "@/types/entities/general-entities";
import { ReactNode, createContext, useState } from "react";

interface UserCoursesDialogsContext {
  renameCourseDialogState: RenameCourseDialogState;
  openRenameCourseDialog: (course: Course) => void;
  closeRenameCourseDialog: () => void;
}

const defaultValues: UserCoursesDialogsContext = {
  // Dialogs state
  openRenameCourseDialog: () => {},
  closeRenameCourseDialog: () => {},
  renameCourseDialogState: {
    isOpen: false,
    selectedCourse: null
  }
};

type RenameCourseDialogState = {
  isOpen: boolean;
  selectedCourse: Course | null;
};

export const UserCoursesDialogsContext =
  createContext<UserCoursesDialogsContext>(defaultValues);

export const UserCoursesDialogsProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  // Dialogs state
  const [renameCourseDialogState, setRenameCourseDialogState] =
    useState<RenameCourseDialogState>({
      isOpen: false,
      selectedCourse: null
    });
  const openRenameCourseDialog = (course: Course) => {
    setRenameCourseDialogState({
      isOpen: true,
      selectedCourse: course
    });
  };

  const closeRenameCourseDialog = () => {
    setRenameCourseDialogState({
      isOpen: false,
      selectedCourse: null
    });
  };

  return (
    <UserCoursesDialogsContext.Provider
      value={{
        renameCourseDialogState,
        openRenameCourseDialog,
        closeRenameCourseDialog
      }}
    >
      {children}
    </UserCoursesDialogsContext.Provider>
  );
};
