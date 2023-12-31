import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CONSTANTS } from "@/config/constants";
import { getSupportedLanguagesService } from "@/services/languages/get-supported-languages.service";
import { useSupportedLanguagesStore } from "@/stores/supported-languages-store";
import { TestBlock } from "@/types/entities/laboratory-entities";
import { downloadLanguageTemplate } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { DownloadIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const testPreviewBlockFormScheme = z.object({
  // Readonly fields
  name: z.string().readonly(),
  language: z.string().readonly(),
  // Editable fields
  submissionFile: z
    .custom<FileList>(
      (val) => val instanceof FileList,
      "You must select a file"
    )
    .refine((files) => files.length === 1, "You must select just one file")
    .transform((files) => files[0] as File)
    .refine(
      (file) => file.size <= CONSTANTS.MAX_ARCHIVE_SIZE,
      "The file should be less than 150KB"
    )
});

interface TestPreviewBlockFormProps {
  testBlock: TestBlock;
  blockIndex: number;
}

export const TestPreviewBlockForm = ({
  testBlock,
  blockIndex
}: TestPreviewBlockFormProps) => {
  const [isSending, setIsSending] = useState(false);

  const { supportedLanguages, setSupportedLanguages, getLanguageNameByUUID } =
    useSupportedLanguagesStore();

  const form = useForm<z.infer<typeof testPreviewBlockFormScheme>>({
    defaultValues: {
      name: testBlock.name,
      language: getLanguageNameByUUID(testBlock.languageUUID)
    },
    resolver: zodResolver(testPreviewBlockFormScheme)
  });

  // Get the supported languages on component mount
  useEffect(() => {
    const getSupportedLanguages = async () => {
      const { success, message, languages } =
        await getSupportedLanguagesService();

      if (!success) {
        toast.error(message);
        return;
      }

      setSupportedLanguages(languages);
      form.setValue("language", getLanguageNameByUUID(testBlock.languageUUID));
    };

    if (supportedLanguages.length === 0) {
      getSupportedLanguages();
    }
  }, []);

  const handleDownloadLanguageTemplate = () => {
    const selectedLanguageUUID = testBlock.languageUUID;
    const selectedLanguageName = form.getValues("language");
    downloadLanguageTemplate(selectedLanguageUUID, selectedLanguageName);
  };

  const handleSubmit = async (
    data: z.infer<typeof testPreviewBlockFormScheme>
  ) => {
    setIsSending(true);
    console.log(data);
    setIsSending(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="grid gap-4 md:grid-cols-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="gap-4">
              <FormLabel>Test name</FormLabel>
              <FormControl>
                <Input {...field} readOnly />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem className="gap-4">
              <FormLabel>Language</FormLabel>
              <div className="flex gap-4">
                <FormControl>
                  <Input {...field} readOnly />
                </FormControl>
                <Button
                  type="button"
                  aria-label={`Download language template for block ${blockIndex}`}
                  onClick={handleDownloadLanguageTemplate}
                >
                  <DownloadIcon size={20} />
                </Button>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="submissionFile"
          render={({ field: { onChange }, ...field }) => {
            return (
              <FormItem className="gap-4">
                <FormLabel>Submission file</FormLabel>
                <div className="flex gap-4">
                  <FormControl>
                    <Input
                      type="file"
                      accept=".zip,application/zip"
                      multiple={false}
                      {...field}
                      onChange={(e) => {
                        onChange(e.target.files);
                      }}
                    />
                  </FormControl>
                  {testBlock.submissionUUID && (
                    <Button
                      type="button"
                      aria-label={`Download current submission file for block ${blockIndex}`}
                    >
                      <DownloadIcon size={20} />
                    </Button>
                  )}
                </div>
                {form.formState.errors.submissionFile && (
                  <FormMessage className="w-full">
                    {form.formState.errors.submissionFile.message}
                  </FormMessage>
                )}
              </FormItem>
            );
          }}
        />
        <Button
          type="submit"
          className="col-span-2 w-min self-end"
          disabled={isSending}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};
