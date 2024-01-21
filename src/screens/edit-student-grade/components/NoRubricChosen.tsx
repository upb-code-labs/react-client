import { buttonVariants } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface noRubricChosenProps {
  courseUUID: string;
  laboratoryUUID: string;
}

export const NoRubricChosen = ({
  courseUUID,
  laboratoryUUID
}: noRubricChosenProps) => {
  return (
    <main className="col-span-3 mx-auto grid h-min max-w-2xl gap-8 md:grid-cols-2">
      <div className="flex max-w-md flex-col items-center justify-center gap-4 md:items-start">
        <h1 className="text-3xl font-bold">No rubric chosen</h1>
        <p className="text-lg text-gray-500">
          In order to provide feedback to your students, you must create and /
          or choose a rubric for this laboratory.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            to={`/rubrics`}
            className={buttonVariants({ variant: "destructive" })}
          >
            Create a rubric
          </Link>
          <Link
            to={`/courses/${courseUUID}/laboratories/${laboratoryUUID}/grades`}
            className={buttonVariants({ variant: "outline" })}
          >
            <ArrowLeftIcon size={24} className="mr-2" /> Go back
          </Link>
        </div>
      </div>
      <div className="-order-1 mx-auto max-w-xs md:order-1 md:max-w-full">
        <img
          src="/images/blank-canvas-image.svg"
          alt="Blank canvas illustration"
        />
      </div>
    </main>
  );
};
