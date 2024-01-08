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
import { updateTestBlockService } from "@/services/blocks/update-test-block.service";
import { getSupportedLanguagesService } from "@/services/languages/get-supported-languages.service";
import { useSupportedLanguagesStore } from "@/stores/supported-languages-store";
import { TestBlock } from "@/types/entities/laboratory-entities";
import { downloadLanguageTemplate } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { DownloadIcon } from "lucide-react";
import { useContext, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { TestBlockDropDown } from "./TestBlockDropDown";

interface EditableTestBlockFormProps {
  testBlock: TestBlock;
  blockIndex: number;
}

const EditableTestBlockFormScheme = z.object({
  name: z
    .string()
    .min(4, "Name must be at least 4 characters long")
    .max(255, "Name must be at most 255 characters long"),
  languageUUID: z.string().uuid("Please select a valid language"),
  testFile: z.optional(
    z
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
  )
});

export const EditableTestBlockForm = ({
  testBlock,
  blockIndex
}: EditableTestBlockFormProps) => {
  const { laboratoryStateDispatcher } = useContext(EditLaboratoryContext);

  const { supportedLanguages, setSupportedLanguages, getLanguageNameByUUID } =
    useSupportedLanguagesStore();

  const getSupportedLanguages = async () => {
    const { success, message, languages } =
      await getSupportedLanguagesService();

    if (!success) {
      toast.error(message);
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

  const form = useForm<z.infer<typeof EditableTestBlockFormScheme>>({
    resolver: zodResolver(EditableTestBlockFormScheme),
    defaultValues: {
      name: testBlock.name,
      languageUUID: testBlock.languageUUID,
      testFile: undefined
    }
  });

  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (data: z.infer<typeof EditableTestBlockFormScheme>) => {
    const { name, languageUUID } = data;

    laboratoryStateDispatcher({
      type: EditLaboratoryActionType.UPDATE_TEST_BLOCK,
      payload: {
        ...testBlock,
        name,
        languageUUID
      }
    });
  };

  const handleSubmit = async (
    data: z.infer<typeof EditableTestBlockFormScheme>
  ) => {
    const { success, message } = await updateTestBlockService({
      blockUUID: testBlock.uuid,
      blockLanguageUUID: data.languageUUID,
      blockName: data.name,
      blockTestArchive: data.testFile
    });

    if (!success) {
      toast.error(message);
      return;
    }

    laboratoryStateDispatcher({
      type: EditLaboratoryActionType.UPDATE_TEST_BLOCK,
      payload: {
        ...testBlock,
        name: data.name,
        languageUUID: data.languageUUID
      }
    });
    toast.success(message);
  };

  const handleDownloadLanguageTemplate = () => {
    const selectedLanguageUUID = form.getValues("languageUUID");
    const selectedLanguageName = getLanguageNameByUUID(selectedLanguageUUID);
    downloadLanguageTemplate(selectedLanguageUUID, selectedLanguageName);
  };

  return (
    <div className="col-span-3 my-8 flex gap-1">
      <Form {...form}>
        <form
          className="grid w-full gap-4 rounded-sm border p-4 pb-6 md:grid-cols-2"
          ref={formRef}
          onChange={form.handleSubmit(handleChange)}
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="gap-4">
                <FormLabel>Block name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a name here..." {...field} />
                </FormControl>
                {form.formState.errors.name && (
                  <FormMessage className="w-full">
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
              <FormItem className="gap-4">
                <FormLabel>Tests language</FormLabel>
                <div className="flex gap-4">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
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
                  {!form.getFieldState("languageUUID").invalid && (
                    <Button
                      type="button"
                      aria-label={`Download language template for block ${blockIndex}`}
                      onClick={handleDownloadLanguageTemplate}
                    >
                      <DownloadIcon size={20} />
                    </Button>
                  )}
                </div>
                {form.formState.errors.languageUUID && (
                  <FormMessage className="w-full">
                    {form.formState.errors.languageUUID.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="testFile"
            render={({ field: { onChange }, ...field }) => {
              return (
                <FormItem className="gap-4">
                  <FormLabel>Tests archive</FormLabel>
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
                    <Button
                      type="button"
                      aria-label={`Download current test archive for block ${blockIndex}`}
                    >
                      <DownloadIcon size={20} />
                    </Button>
                  </div>
                  {form.formState.errors.testFile && (
                    <FormMessage className="w-full">
                      {form.formState.errors.testFile.message}
                    </FormMessage>
                  )}
                </FormItem>
              );
            }}
          />
        </form>
      </Form>
      <TestBlockDropDown
        blockUUID={testBlock.uuid}
        blockIndex={blockIndex}
        formRef={formRef}
      />
    </div>
  );
};
