import { Course } from "@/types/entities/general-entities";
import { getCourseInitials } from "@/utils/get-course-initials";
import { Link } from "react-router-dom";

import { CourseDropDown } from "./CourseDropDown";

interface CourseCardProps {
  course: Course;
  isHidden: boolean;
}

export const CourseCard = ({ course, isHidden }: CourseCardProps) => {
  return (
    <Link to={`/courses/${course.uuid}/laboratories`}>
      <div className="relative mx-auto flex aspect-square w-full max-w-xs flex-col items-center justify-center gap-4 rounded-xl border p-4 text-center shadow-md transition-shadow hover:shadow-lg">
        {/* Course dropdown */}
        <CourseDropDown course={course} isHidden={isHidden} />

        {/* Course initials and color */}
        <div
          className="grid aspect-square w-[45%] place-items-center rounded-2xl text-3xl font-bold -tracking-tight text-white"
          style={{ backgroundColor: course.color }}
        >
          {getCourseInitials(course.name)}
        </div>

        {/* Course name */}
        <h2 className="line-clamp-2 text-lg">{course.name}</h2>
      </div>
    </Link>
  );
};
