import { GenericTableSkeleton } from "@/components/Skeletons/GenericTableSkeleton";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { AuthContext } from "@/context/AuthContext";
import { LaboratoryBaseInfo } from "@/types/entities/laboratory-entities";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { BarChartBigIcon, BookOpenCheck, Edit } from "lucide-react";
import { useContext } from "react";
import { Link, useParams } from "react-router-dom";

dayjs.extend(relativeTime);

interface courseLaboratoriesTableProps {
  loading: boolean;
  laboratories: LaboratoryBaseInfo[] | undefined;
}

export const CourseLaboratoriesTable = ({
  loading,
  laboratories
}: courseLaboratoriesTableProps) => {
  const { user } = useContext(AuthContext);
  const { courseUUID } = useParams<{ courseUUID: string }>();

  const getLaboratoryActionsByRole = ({
    role,
    labInfo
  }: {
    role: string;
    labInfo: LaboratoryBaseInfo;
  }) => {
    if (role === "teacher") {
      return (
        <>
          <Link
            className={buttonVariants({ variant: "default" })}
            aria-label={`Edit ${labInfo.name} laboratory`}
            to={`/courses/${courseUUID}/laboratories/${labInfo.uuid}/edit`}
          >
            <Edit className="mr-2" /> Edit
          </Link>
          <Link
            className={buttonVariants({ variant: "default" })}
            aria-label={`View ${labInfo.name} laboratory progress`}
            to={`/courses/${courseUUID}/laboratories/${labInfo.uuid}/progress`}
          >
            <BarChartBigIcon className="mr-2" /> View progress
          </Link>
        </>
      );
    } else {
      return (
        <>
          <Link
            aria-label={`Complete ${labInfo.name} laboratory`}
            className={buttonVariants({ variant: "default" })}
            to={`/courses/${courseUUID}/laboratories/${labInfo.uuid}/complete`}
          >
            <BookOpenCheck className="mr-2" /> Complete
          </Link>
        </>
      );
    }
  };

  if (loading) {
    return (
      <GenericTableSkeleton
        headers={["Name", "Opening date", "Due date", "Actions"]}
        columns={4}
        rows={8}
      />
    );
  }

  return (
    <div className="rounded-md border">
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
          {laboratories?.length ? (
            laboratories.map((lab) => (
              <TableRow key={lab.uuid}>
                <TableCell>{lab.name}</TableCell>
                <TableCell className="first-letter:uppercase">
                  {dayjs(lab.opening_date).fromNow()}
                </TableCell>
                <TableCell className="first-letter:capitalize">
                  {dayjs(lab.due_date).fromNow()}
                </TableCell>
                <TableCell>
                  <div className="flex max-w-sm flex-wrap gap-4">
                    {getLaboratoryActionsByRole({
                      role: user!.role,
                      labInfo: lab
                    })}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
