import { GenericTableSkeleton } from "@/components/Skeletons/GenericTableSkeleton";
import { EmptyContentText } from "@/components/Texts/EmptyContentText";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { getEnrolledStudentsService } from "@/services/courses/get-enrolled-students.service";
import { EnrolledStudent } from "@/types/entities/enrolled-student";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { EnrollStudentDialog } from "./dialogs/enroll-student/EnrollStudentDialog";

export const CourseParticipants = () => {
  const { courseUUID = "" } = useParams<{ courseUUID: string }>();
  const navigate = useNavigate();

  const [state, setState] = useState<"loading" | "idle">("loading");
  const [students, setStudents] = useState<EnrolledStudent[]>([]);

  useEffect(() => {
    getStudents();
  }, []);

  const getStudents = async () => {
    const { success, ...response } =
      await getEnrolledStudentsService(courseUUID);
    if (!success) {
      toast.error(response.message);
      navigate("/courses");
    }

    setStudents(response.students);
    setState("idle");
  };

  const addStudent = (student: EnrolledStudent) => {
    setStudents((prev) => [...prev, student]);
  };

  const renderParticipants = () => {
    if (state === "loading") {
      return (
        <GenericTableSkeleton
          columns={3}
          rows={4}
          headers={["Full name", "Institutional Id", "Actions"]}
        />
      );
    }

    if (students.length === 0) {
      return <EmptyContentText text="There are no students enrolled yet" />;
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full name</TableHead>
            <TableHead>Institutional Id</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.uuid}>
              <TableCell>{student.full_name}</TableCell>
              <TableCell>{student.institutional_id}</TableCell>
              <TableCell>
                <Button variant={"destructive"}>Deactivate</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <main className="md:col-span-3">
      <div className="mb-4 flex flex-col items-start justify-between md:flex-row md:items-center">
        <h1 className="my-4 text-3xl font-bold">Enrolled students</h1>
        <EnrollStudentDialog addStudentCallback={addStudent} />
      </div>
      {renderParticipants()}
    </main>
  );
};
