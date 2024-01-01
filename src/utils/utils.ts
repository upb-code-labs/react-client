import { downloadLanguageTemplateService } from "@/services/languages/download-language-template.service";
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

  downloadBlob({
    file: template,
    fileName: `${languageName.toLowerCase()}-template.zip`
  });
}
