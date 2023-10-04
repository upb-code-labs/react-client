import { CoursesActions } from "@/hooks/courses/coursesReducer";
import { CoursesState, useCourses } from "@/hooks/courses/useCourses";
import { ReactNode, createContext } from "react";

interface UserCoursesContext {
  isLoading: boolean;
  userCourses: CoursesState;
  userCoursesDispatcher: React.Dispatch<CoursesActions>;
}

const defaultValues: UserCoursesContext = {
  isLoading: false,
  userCourses: {
    courses: [],
    hiddenCourses: []
  },
  userCoursesDispatcher: () => {}
};

export const UserCoursesContext =
  createContext<UserCoursesContext>(defaultValues);

export const UserCoursesProvider = ({ children }: { children: ReactNode }) => {
  const { loading, courses, coursesDispatcher } = useCourses();

  return (
    <UserCoursesContext.Provider
      value={{
        isLoading: loading,
        userCourses: courses,
        userCoursesDispatcher: coursesDispatcher
      }}
    >
      {children}
    </UserCoursesContext.Provider>
  );
};
