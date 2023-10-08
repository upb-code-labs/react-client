import { CoursesActions } from "@/hooks/courses/coursesReducer";
import { CoursesState, useCourses } from "@/hooks/courses/useCourses";
import { Course } from "@/types/entities/course";
import { ReactNode, createContext, useState } from "react";

interface UserCoursesContext {
  isLoading: boolean;
  userCourses: CoursesState;
  userCoursesDispatcher: React.Dispatch<CoursesActions>;

  renameCourseDialogState: RenameCourseDialogState;
  openRenameCourseDialog: (course: Course) => void;
  closeRenameCourseDialog: () => void;
}

const defaultValues: UserCoursesContext = {
  // Courses state
  isLoading: false,
  userCourses: {
    courses: [],
    hiddenCourses: []
  },
  userCoursesDispatcher: () => {},

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

export const UserCoursesContext =
  createContext<UserCoursesContext>(defaultValues);

export const UserCoursesProvider = ({ children }: { children: ReactNode }) => {
  const { loading, courses, coursesDispatcher } = useCourses();

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
    <UserCoursesContext.Provider
      value={{
        isLoading: loading,
        userCourses: courses,
        userCoursesDispatcher: coursesDispatcher,
        renameCourseDialogState,
        openRenameCourseDialog,
        closeRenameCourseDialog
      }}
    >
      {children}
    </UserCoursesContext.Provider>
  );
};
