import { CoursePageTabularOutletSkeleton } from "../../skeletons/CoursePageTabularOutletSkeleton";

export const CourseLaboratoriesOutletSkeleton = () => {
  return (
    <CoursePageTabularOutletSkeleton
      tableColumns={4}
      tableRows={4}
      tableHeaders={["Name", "Opening date", "Due date", "Actions"]}
    />
  );
};
