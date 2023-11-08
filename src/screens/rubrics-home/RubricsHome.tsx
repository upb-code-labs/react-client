import { GenericTableSkeleton } from "@/components/Skeletons/GenericTableSkeleton";
import { EmptyContentText } from "@/components/Texts/EmptyContentText";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { getTeacherRubricsService } from "@/services/rubrics/get-teacher-rubrics.service";
import { CreatedRubric } from "@/types/entities/rubric";
import { PenSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { CreateRubricDialog } from "./dialogs/CreateRubricDialog";

export const RubricsHome = () => {
  const [loading, setLoading] = useState(true);
  const [rubrics, setRubrics] = useState<CreatedRubric[]>([]);

  useEffect(() => {
    getRubrics();
  }, []);

  const getRubrics = async () => {
    setLoading(true);
    const { success, ...response } = await getTeacherRubricsService();

    if (!success) {
      toast.error(response.message);
      setLoading(false);
      return;
    }

    setRubrics(response.rubrics);
    setLoading(false);
  };

  const addRubric = (rubric: CreatedRubric) => {
    setRubrics((prev) => [...prev, rubric]);
  };

  const renderRubrics = () => {
    if (loading) {
      return (
        <GenericTableSkeleton
          columns={2}
          rows={4}
          headers={["Name", "Options"]}
        />
      );
    }

    if (rubrics.length === 0) {
      return <EmptyContentText text="You don't have any rubrics yet" />;
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Options</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rubrics.map((rubric) => (
            <TableRow key={rubric.uuid}>
              <TableCell className="line-clamp-1">{rubric.name}</TableCell>
              <TableCell>
                <Link
                  to={`/rubrics/${rubric.uuid}`}
                  aria-label={`Edit ${rubric.name}`}
                  className={buttonVariants({ variant: "default" })}
                >
                  <PenSquare className="mr-2" />
                  Edit
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4">
      <div className="mb-2 flex flex-col items-start justify-between md:flex-row md:items-center">
        <h1 className="my-4 text-3xl font-bold">Your rubrics</h1>
        <CreateRubricDialog addRubricCallback={addRubric} />
      </div>
      <main>{renderRubrics()}</main>
    </div>
  );
};
