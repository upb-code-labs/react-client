import { AuthContext } from "@/context/AuthContext";
import { getCourseService } from "@/services/courses/get-course.service";
import { getCourseInitials } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import { Fragment, useContext } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { CourseAsideOptions } from "./CourseAsideOptions";
import { CourseNavigationSkeleton } from "./CourseNavigationSkeleton";

export const CoursePageLayout = () => {
  // Url state
  const { courseUUID = "" } = useParams<{ courseUUID: string }>();
  const navigate = useNavigate();

  // Global user state
  const { user } = useContext(AuthContext);
  const role = user?.role || "student";
  // Fetching state
  const {
    data: course,
    isLoading,
    isError: isCourseError,
    error: courseError
  } = useQuery({
    queryKey: ["course", courseUUID],
    queryFn: () => getCourseService(courseUUID)
  });

  if (isCourseError) {
    toast.error(courseError.message);
    navigate("/courses");
  }

  if (!isLoading && !course) {
    // TODO: Return the error component if its not loading and there is no course
    return null;
  }

  return (
    <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl auto-rows-min gap-4 p-4 md:auto-rows-auto md:grid-cols-4">
      <aside className="space-y-8 pb-2 pr-2 md:border-r md:pb-0">
        {isLoading ? (
          <CourseNavigationSkeleton />
        ) : (
          <Fragment>
            {/* Course initials and name */}
            <div className="space-y-4">
              <div
                className="grid aspect-square w-24 place-items-center rounded-2xl text-3xl font-bold -tracking-tight text-white"
                style={{ backgroundColor: course!.color }}
              >
                {getCourseInitials(course!.name)}
              </div>
              <h1 className="line-clamp-2 text-xl font-medium">
                {course!.name}
              </h1>
            </div>
            {/* Course navigation */}
            <ul className="flex flex-wrap gap-4 md:flex-col">
              {CourseAsideOptions[role].map((option) => (
                <li
                  className="py-1 text-foreground/75 transition-colors hover:text-foreground"
                  key={option.path}
                >
                  <Link to={option.path.replace(":id", courseUUID)}>
                    {option.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Fragment>
        )}
      </aside>
      {/* Outlet is defined by every nested route */}
      <Outlet />
    </div>
  );
};
