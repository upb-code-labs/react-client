import { FoundStudentCard } from "@/components/FoundStudentCard/FoundStudentCard";
import { FoundStudentsSkeleton } from "@/components/FoundStudentCard/FoundStudentsSkeleton";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import useDebounce from "@/hooks/useDebounce";
import { searchStudentByFullNameService } from "@/services/accounts/search-student-by-fullname.service";
import { Student } from "@/types/entities/student";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";

export const EnrollStudentForm = () => {
  // Search state
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearch(value);
  };

  useEffect(() => {
    searchStudents(debouncedSearch);
  }, [debouncedSearch]);

  const searchStudents = async (criteria: string) => {
    if (debouncedSearch === "") return;

    setLoading(true);
    const { success, ...response } =
      await searchStudentByFullNameService(criteria);
    if (!success) {
      toast.error(response.message);
      return;
    }

    setStudents(response.students);
    setLoading(false);
  };

  // Results state
  const [students, setStudents] = useState<Student[]>([]);

  const displayResults = () => {
    if (search === "") return null;

    if (loading) return <FoundStudentsSkeleton />;

    if (students.length === 0) {
      return <p className="text-muted-foreground">No students found 🤷</p>;
    } else {
      return (
        <ScrollArea className="max-h-56">
          {students.map((student) => (
            <FoundStudentCard student={student} />
          ))}
        </ScrollArea>
      );
    }
  };

  return (
    <Fragment>
      <Input
        placeholder="Enter a full name to search for a student here..."
        aria-label="Search for a student by their full name"
        onChange={handleSearchChange}
        value={search}
        autoFocus
      />
      {displayResults()}
    </Fragment>
  );
};
