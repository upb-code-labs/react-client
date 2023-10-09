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
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { CourseParticipantsSkeleton } from "./CourseParticipantsSkeleton";

export const CourseParticipants = () => {
  const { id = "emtpy" } = useParams();
  const navigate = useNavigate();

  const [state, setState] = useState<"loading" | "idle">("loading");
  const [students, setStudents] = useState<EnrolledStudent[]>([]);

  useEffect(() => {
    getStudents();
  }, []);

  const getStudents = async () => {
    const { success, ...response } = await getEnrolledStudentsService(id);
    if (!success) {
      toast.error(response.message);
      navigate("/courses");
    }

    setStudents(response.students);
    setState("idle");
  };

  return (
    <main className="md:col-span-3">
      <div className="mb-4 flex flex-col items-start justify-between md:flex-row md:items-center">
        <h1 className="my-4 text-3xl font-bold">Enrolled students</h1>
        <Button>
          <PlusCircle className="mr-3" />
          Enroll student
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full name</TableHead>
            <TableHead>Institutional Id</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {state === "loading"
            ? Array.from({ length: 4 }).map((_, i) => (
                <CourseParticipantsSkeleton
                  key={`enrolled-student-skeleton-${i}`}
                />
              ))
            : students.map((student) => (
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
    </main>
  );
};
