import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { PlusCircle } from "lucide-react";

import { EnrollStudentForm } from "./EnrollStudentForm";

export const EnrollStudentDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-3" />
          Enroll student
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogTitle>Enroll student</DialogTitle>
        <DialogDescription>
          Search for a student by their full name and click on the result to
          enroll them in this course.
        </DialogDescription>
        <EnrollStudentForm />
      </DialogContent>
    </Dialog>
  );
};
