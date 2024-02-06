import { Outlet } from "react-router-dom";

import { CourseNavigationSkeleton } from "../CourseNavigationSkeleton";

export const CoursePageLayoutSkeleton = () => {
  return (
    <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl auto-rows-min gap-4 p-4 md:auto-rows-auto md:grid-cols-4">
      <aside className="space-y-8 pb-2 pr-2 md:border-r md:pb-0">
        <CourseNavigationSkeleton />
      </aside>
      <Outlet />
    </div>
  );
};
