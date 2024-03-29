import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { studentGradeResponse } from "@/services/grades/get-grade-of-student-in-laboratory.service";

import { GradingForm } from "./grade-form/GradingForm";
import { GradingSubmissionsSummary } from "./submissions/GradingSubmissionsSummary";

type gradingSidebarProps = {
  laboratoryUUID: string;
  studentUUID: string;
  studentGrade: studentGradeResponse;
};

export const GradingSidebar = ({
  laboratoryUUID,
  studentUUID,
  studentGrade
}: gradingSidebarProps) => {
  return (
    <aside>
      <Tabs defaultValue="grade" className="max-w-xs md:max-w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="grade">Grade form</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
        </TabsList>
        <TabsContent value="grade">
          <GradingForm
            key={studentGrade.grade}
            laboratoryUUID={laboratoryUUID}
            studentUUID={studentUUID}
            studentGrade={studentGrade}
          />
        </TabsContent>
        <TabsContent value="submissions">
          <GradingSubmissionsSummary
            laboratoryUUID={laboratoryUUID}
            studentUUID={studentUUID}
          />
        </TabsContent>
      </Tabs>
    </aside>
  );
};
