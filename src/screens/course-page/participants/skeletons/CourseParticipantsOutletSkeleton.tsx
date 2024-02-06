import { CoursePageTabularOutletSkeleton } from "../../skeletons/CoursePageTabularOutletSkeleton";

export const CourseParticipantsOutletSkeleton = () => {
  return (
    <CoursePageTabularOutletSkeleton
      tableColumns={3}
      tableRows={4}
      tableHeaders={["Full name", "Institutional Id", "Actions"]}
    />
  );
};
