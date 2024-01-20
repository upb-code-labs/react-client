import { Button } from "@/components/ui/button";
import { summarizedStudentSubmission } from "@/services/laboratories/ger-progress-of-student.service";
import { getSubmissionArchiveService } from "@/services/submissions/get-submission-archive.service";
import { downloadBlob } from "@/utils/utils";
import { DownloadIcon } from "lucide-react";
import { toast } from "sonner";

interface submissionSummaryCardProps {
  summarizedSubmission: summarizedStudentSubmission;
}

type summarizedSubmissionStatus = "pending" | "running" | "success" | "failed";

const statusToColor: Record<summarizedSubmissionStatus, string> = {
  pending: "bg-gray-400",
  running: "bg-indigo-400",
  success: "bg-emerald-400",
  failed: "bg-red-400"
};

export const SubmissionSummaryCard = ({
  summarizedSubmission
}: submissionSummaryCardProps) => {
  // Helper function
  const getStatusColor = (): string => {
    const { status, is_passing } = summarizedSubmission;
    if (status === "ready") {
      return is_passing ? statusToColor.success : statusToColor.failed;
    } else {
      return statusToColor[status];
    }
  };

  const getStatusText = (): string => {
    const { status, is_passing } = summarizedSubmission;
    if (status === "ready") {
      return is_passing ? "Passed" : "Failed";
    } else {
      return status;
    }
  };

  // Handlers
  const handleDownloadCode = async () => {
    const { success, message, submissionArchive } =
      await getSubmissionArchiveService(summarizedSubmission.uuid);

    if (!success) {
      toast.error(message);
      return;
    }

    const joinedBlockName = summarizedSubmission.test_block_name
      .replace(/\s/g, "_")
      .toLowerCase();

    downloadBlob({
      file: submissionArchive,
      fileName: `${joinedBlockName}.zip`
    });

    toast.success("The code has been downloaded successfully");
  };

  return (
    <div className="flex flex-wrap justify-between gap-2 rounded-md border p-4 shadow-sm">
      {/* Submission header */}
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold">
          {summarizedSubmission.test_block_name}
        </h3>
        <span className="flex items-center gap-1 capitalize text-black/75">
          <span className={`h-3 w-3 rounded-full ${getStatusColor()}`} />
          {getStatusText()}
        </span>
      </div>
      {/* Submission body */}
      <div className="flex items-center">
        <Button
          size={"icon"}
          onClick={handleDownloadCode}
          aria-label={`Download code sent by the student for the ${summarizedSubmission.test_block_name} test block`}
        >
          <DownloadIcon size={20} />
        </Button>
      </div>
    </div>
  );
};
