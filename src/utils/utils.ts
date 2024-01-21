import { downloadLanguageTemplateService } from "@/services/languages/download-language-template.service";
import { getSubmissionArchiveService } from "@/services/submissions/get-submission-archive.service";
import { submissionUpdate } from "@/types/entities/submission-entities";
import { toast } from "sonner";

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

export function getCourseInitials(courseName: string) {
  const hasOneWord = courseName.split(" ").length === 1;
  if (hasOneWord) {
    const firstTwoLetters = courseName.slice(0, 2);
    return firstTwoLetters.toUpperCase();
  } else {
    const firstTwoWords = courseName.split(" ").slice(0, 2);
    const firstLetterOfEachWord = firstTwoWords.map((word) => word[0]);
    return firstLetterOfEachWord.join("").toUpperCase();
  }
}

interface DownloadBlobRequest {
  file: Blob;
  fileName: string;
}

export function downloadBlob({ file, fileName }: DownloadBlobRequest) {
  // Create a blob URL for the file
  const blobUrl = window.URL.createObjectURL(file);

  // Create a link element to download the file
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = fileName;
  link.click();

  // Remove the link element
  link.remove();
}

export async function downloadLanguageTemplate(
  languageUUID: string,
  languageName: string
) {
  const { success, template } =
    await downloadLanguageTemplateService(languageUUID);

  if (!success) {
    toast.error("Failed to download language template");
    return;
  }

  const joinedLanguageName = languageName.split(" ").join("-");

  downloadBlob({
    file: template,
    fileName: `${joinedLanguageName.toLowerCase()}-template.zip`
  });
}

export async function downloadSubmissionArchive(
  submissionUUID: string,
  fileName: string
) {
  const { success, message, submissionArchive } =
    await getSubmissionArchiveService(submissionUUID);

  if (!success) {
    toast.error(message);
    return;
  }

  downloadBlob({
    file: submissionArchive,
    fileName
  });

  toast.success("The submission archive has been downloaded successfully");
}

export function parseSubmissionSSEUpdate(data: string): submissionUpdate {
  const parsedData = JSON.parse(data);

  return {
    submissionUUID: parsedData.submission_uuid,
    submissionStatus: parsedData.submission_status,
    testsPassed: parsedData.tests_passed,
    testsOutput: parsedData.tests_output
  };
}
