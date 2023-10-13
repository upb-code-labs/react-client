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
import { getTeacherRubricsService } from "@/services/rubrics/get-teacher-rubrics.service";
import { CreatedRubric } from "@/types/entities/rubric";
import { PenSquare, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
              <TableCell>{rubric.name}</TableCell>
              <TableCell>
                <Button>
                  <PenSquare className="mr-2" />
                  Edit
                </Button>
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
        <Button>
          <PlusCircle className="mr-2" />
          Create rubric
        </Button>
      </div>
      <main>{renderRubrics()}</main>
    </div>
  );
};
