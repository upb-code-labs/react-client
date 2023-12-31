import { GenericTableSkeleton } from "@/components/Skeletons/GenericTableSkeleton";
import { DataTable } from "@/components/ui/data-table";
import { EnrolledStudent } from "@/types/entities/general-entities";
import { ColumnDef } from "@tanstack/react-table";

interface CourseParticipantsTableProps {
  isLoading: boolean;
  tableColsDefinition: ColumnDef<EnrolledStudent>[];
  students: EnrolledStudent[];
}

export const CourseParticipantsTable = ({
  isLoading,
  tableColsDefinition,
  students
}: CourseParticipantsTableProps) => {
  if (isLoading) {
    return (
      <GenericTableSkeleton
        columns={3}
        rows={4}
        headers={["Full name", "Institutional Id", "Actions"]}
      />
    );
  }

  return <DataTable columns={tableColsDefinition} data={students} />;
};
