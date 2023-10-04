import { Course } from "@/types/entities/course";

import { CoursesState } from "./useCourses";

export enum CoursesActionType {
  SET_COURSES = "SET_COURSES",
  ADD_COURSE = "ADD_COURSE",
  HIDE_COURSE = "HIDE_COURSE",
  SHOW_COURSE = "SHOW_COURSE"
}

export type CoursesActions =
  | {
      type: CoursesActionType.SET_COURSES;
      payload: { courses: Course[]; hiddenCourses: Course[] };
    }
  | { type: CoursesActionType.ADD_COURSE; payload: { course: Course } }
  | { type: CoursesActionType.HIDE_COURSE; payload: { uuid: string } }
  | { type: CoursesActionType.SHOW_COURSE; payload: { uuid: string } };

export function coursesReducer(state: CoursesState, action: CoursesActions) {
  switch (action.type) {
    case CoursesActionType.SET_COURSES:
      return {
        courses: action.payload.courses,
        hiddenCourses: action.payload.hiddenCourses
      };
    case CoursesActionType.ADD_COURSE:
      return {
        ...state,
        courses: [...state.courses, action.payload.course]
      };
    case CoursesActionType.HIDE_COURSE: {
      const courseIndex = state.courses.findIndex(
        (course) => course.uuid === action.payload.uuid
      );
      if (courseIndex === -1) return state;

      // Remove the course form the "courses" array
      const course = state.courses[courseIndex];
      const courses = [
        ...state.courses.slice(0, courseIndex),
        ...state.courses.slice(courseIndex + 1)
      ];

      // Add the course to the "hiddenCourses" array
      const hiddenCourses = [...state.hiddenCourses, course];

      return {
        ...state,
        courses,
        hiddenCourses
      };
    }
    case CoursesActionType.SHOW_COURSE: {
      const courseIndex = state.hiddenCourses.findIndex(
        (course) => course.uuid === action.payload.uuid
      );
      if (courseIndex === -1) return state;

      // Remove the course form the "hiddenCourses" array
      const course = state.hiddenCourses[courseIndex];
      const hiddenCourses = [
        ...state.hiddenCourses.slice(0, courseIndex),
        ...state.hiddenCourses.slice(courseIndex + 1)
      ];

      // Add the course to the "courses" array
      const courses = [...state.courses, course];

      return {
        ...state,
        courses,
        hiddenCourses
      };
    }
    default:
      return state;
  }
}
