import { EmptyContentText } from "@/components/EmptyContentText";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import useDebounce from "@/hooks/useDebounce";
import { FoundStudentsSkeleton } from "@/screens/course-page/participants/components/FoundStudentsSkeleton";
import { searchStudentByFullNameService } from "@/services/accounts/search-student-by-fullname.service";
import { Student } from "@/types/entities/general-entities";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";

import { FoundStudentCard } from "../../components/FoundStudentCard";

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
      setLoading(false);
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
      return <EmptyContentText text="No students found" />;
    } else {
      return (
        <ScrollArea className="max-h-56">
          <div className="p-1">
            {students.map((student) => (
              <FoundStudentCard
                key={`found-student-card-${student.uuid}`}
                student={student}
              />
            ))}
          </div>
        </ScrollArea>
      );
    }
  };

  return (
    <Fragment>
      <Input
        placeholder="Enter a full name to search for a student here..."
        aria-label="Search students by full name"
        onChange={handleSearchChange}
        value={search}
        autoFocus
      />
      {displayResults()}
    </Fragment>
  );
};
