import { Course } from "@/types/entities/course";
import { getCourseInitials } from "@/utils/get-course-initials";

interface CourseCardProps {
  course: Course;
}

export const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <div
      key={course.uuid}
      className="mx-auto flex aspect-square w-full max-w-xs flex-col items-center justify-center gap-4 rounded-xl border p-4 text-center shadow-md transition-shadow hover:shadow-lg"
    >
      <div
        className="grid aspect-square w-[45%] place-items-center rounded-2xl text-3xl font-bold -tracking-tight text-white"
        style={{ backgroundColor: course.color }}
      >
        <p className="absolute border-red-500"></p>
        {getCourseInitials(course.name)}
      </div>
      <span className="line-clamp-2 text-lg">{course.name}</span>
    </div>
  );
};
