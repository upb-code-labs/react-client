import { useSession } from "@/hooks/useSession";
import { LaboratoryBaseInfo } from "@/types/entities/laboratory";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { BookOpenCheck, Edit } from "lucide-react";
import { Link } from "react-router-dom";

import { GenericTableSkeleton } from "../Skeletons/GenericTableSkeleton";
import { EmptyContentText } from "../Texts/EmptyContentText";
import { buttonVariants } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../ui/table";

dayjs.extend(relativeTime);

interface courseLaboratoriesTableProps {
  loading: boolean;
  laboratories: LaboratoryBaseInfo[];
}

export const CourseLaboratoriesTable = ({
  loading,
  laboratories
}: courseLaboratoriesTableProps) => {
  const { user } = useSession();

  if (loading) {
    return (
      <GenericTableSkeleton
        headers={["Name", "Opening date", "Due date", "Actions"]}
        columns={4}
        rows={8}
      />
    );
  }

  if (laboratories.length === 0) {
    return <EmptyContentText text="There are no laboratories to show" />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Opening date</TableHead>
          <TableHead>Due date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {laboratories.map((lab) => (
          <TableRow key={lab.uuid}>
            <TableCell>{lab.name}</TableCell>
            <TableCell className="first-letter:uppercase">
              {dayjs(lab.opening_date).fromNow()}
            </TableCell>
            <TableCell className="first-letter:capitalize">
              {dayjs(lab.due_date).fromNow()}
            </TableCell>
            <TableCell>
              {user?.role === "teacher" ? (
                <>
                  <Link
                    className={buttonVariants({ variant: "default" })}
                    aria-label={`Edit ${lab.name} laboratory`}
                    to={`/laboratories/${lab.uuid}/edit`}
                  >
                    <Edit className="mr-2" /> Edit
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    aria-label={`Complete ${lab.name} laboratory`}
                    className={buttonVariants({ variant: "default" })}
                    to={`/laboratories/${lab.uuid}/complete`}
                  >
                    <BookOpenCheck className="mr-2" /> Complete
                  </Link>
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
