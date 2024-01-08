import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { CONSTANTS } from "@/config/constants";
import { EditLaboratoryContext } from "@/context/laboratories/EditLaboratoryContext";
import { EditLaboratoryActionType } from "@/hooks/laboratories/editLaboratoryTypes";
import { createTestBlockService } from "@/services/laboratories/add-test-block.service";
import { getSupportedLanguagesService } from "@/services/languages/get-supported-languages.service";
import { useSupportedLanguagesStore } from "@/stores/supported-languages-store";
import { downloadLanguageTemplate } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { DownloadIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";

const CreateTestBlockSchema = z.object({
  name: z
    .string()
    .min(4, "Name must be at least 4 characters long")
    .max(255, "Name must be at most 255 characters long"),
  languageUUID: z.string().uuid("Please select a valid language"),
  testFile: z
    .custom<FileList>(
      (val) => val instanceof FileList,
      "You must select a file"
    )
    .refine((files) => files.length === 1, "You must select a file")
    .transform((files) => files[0] as File)
    .refine(
      (file) => file.size <= CONSTANTS.MAX_ARCHIVE_SIZE,
      "The file should be less than 150KB"
    )
});

interface CreateTestBlockFormProps {
  closeDialogCallback: () => void;
}

export const CreateTestBlockForm = ({
  closeDialogCallback
}: CreateTestBlockFormProps) => {
  const { laboratoryUUID } = useParams<{
    laboratoryUUID: string;
    courseUUID: string;
  }>();

  const { laboratoryStateDispatcher } = useContext(EditLaboratoryContext);

  const { supportedLanguages, setSupportedLanguages, getLanguageNameByUUID } =
    useSupportedLanguagesStore();

  const getSupportedLanguages = async () => {
    const { success, message, languages } =
      await getSupportedLanguagesService();
    if (!success) {
      toast.error(message);
      closeDialogCallback();
      return;
    }

    setSupportedLanguages(languages);
  };

  // Get the supported languages on component mount
  useEffect(() => {
    if (supportedLanguages.length === 0) {
      getSupportedLanguages();
    }
  }, []);

  // Form state
  const [isSending, setIsSending] = useState(false);

  const form = useForm<z.infer<typeof CreateTestBlockSchema>>({
    resolver: zodResolver(CreateTestBlockSchema),
    defaultValues: {
      name: "",
      languageUUID: "",
      testFile: undefined
    }
  });

  const formSubmitCallback = async (
    data: z.infer<typeof CreateTestBlockSchema>
  ) => {
    setIsSending(true);
    await createTestBlock(data);
    setIsSending(false);
  };

  // Actions
  const createTestBlock = async (
    data: z.infer<typeof CreateTestBlockSchema>
  ) => {
    const { success, message, uuid } = await createTestBlockService({
      laboratoryUUID: laboratoryUUID as string,
      blockLanguageUUID: data.languageUUID,
      blockName: data.name,
      blockTestArchive: data.testFile
    });

    if (!success) {
      toast.error(message);
      return;
    }

    // Add the block to the global state
    laboratoryStateDispatcher({
      type: EditLaboratoryActionType.ADD_TEST_BLOCK,
      payload: {
        uuid: uuid,
        name: data.name,
        languageUUID: data.languageUUID,
        testArchiveUUID: "PLACEHOLDER"
      }
    });

    // Close the dialog
    toast.success(message);
    closeDialogCallback();
  };

  const handleDownloadSelectedLanguageTemplate = async () => {
    const selectedLanguageUUID = form.getValues("languageUUID");
    const selectedLanguageName = getLanguageNameByUUID(selectedLanguageUUID);
    downloadLanguageTemplate(selectedLanguageUUID, selectedLanguageName);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formSubmitCallback)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="mb-4 grid grid-cols-4 items-center gap-x-4">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a name here..."
                  className="col-span-3"
                  {...field}
                />
              </FormControl>
              {form.formState.errors.name && (
                <FormMessage className="col-span-3 col-start-2">
                  {form.formState.errors.name.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="languageUUID"
          render={({ field }) => (
            <FormItem className="mb-4 grid grid-cols-4 items-center gap-x-4">
              <FormLabel>Language</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || undefined}
              >
                <FormControl>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {supportedLanguages.map((language) => (
                    <SelectItem
                      key={`language-option-${language.uuid}`}
                      value={language.uuid}
                    >
                      {language.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.languageUUID && (
                <FormMessage className="col-span-3 col-start-2">
                  {form.formState.errors.languageUUID.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />
        {form.getValues("languageUUID") && (
          <div className="mb-2 grid grid-cols-4 gap-4">
            <Button
              type="button"
              className="col-span-3 col-start-2"
              onClick={handleDownloadSelectedLanguageTemplate}
            >
              <DownloadIcon className="mr-2" size={16} />
              Download template
            </Button>
          </div>
        )}
        <FormField
          control={form.control}
          name="testFile"
          render={({ field: { onChange }, ...field }) => {
            return (
              <FormItem className="mb-4 grid grid-cols-4 items-center gap-x-4">
                <FormLabel>Test file</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".zip,application/zip"
                    className="col-span-3"
                    multiple={false}
                    {...field}
                    onChange={(e) => {
                      onChange(e.target.files);
                    }}
                  />
                </FormControl>
                {form.formState.errors.testFile && (
                  <FormMessage className="col-span-3 col-start-2">
                    {form.formState.errors.testFile.message}
                  </FormMessage>
                )}
              </FormItem>
            );
          }}
        />
        <DialogFooter>
          <Button type="submit" isLoading={isSending}>
            Add
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
