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
import { CourseLaboratoriesContext } from "@/context/laboratories/CourseLaboratoriesContext";
import { courseLaboratoriesActionType } from "@/hooks/laboratories/courseLaboratoriesReducer";
import { createLaboratoryService } from "@/services/laboratories/create-laboratory.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";

const createLaboratorySchema = z
  .object({
    name: z
      .string()
      .min(4, "Name must be at least 4 characters long")
      .max(255, "Name must be at most 255 characters long"),
    openingDate: z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
        "You must select a valid opening date"
      ),
    dueDate: z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
        "You must select a valid closing date"
      )
  })
  .refine(
    (data) => {
      const openingDate = new Date(data.openingDate);
      const closingDate = new Date(data.dueDate);
      return openingDate < closingDate;
    },
    {
      message: "The closing date must be after the opening date",
      path: ["closingDate"]
    }
  );

interface CreateLaboratoryFormProps {
  closeDialogCallback: () => void;
}

export const CreateLaboratoryForm = ({
  closeDialogCallback
}: CreateLaboratoryFormProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof createLaboratorySchema>>({
    resolver: zodResolver(createLaboratorySchema),
    defaultValues: {
      name: "",
      openingDate: "",
      dueDate: ""
    }
  });

  const { id } = useParams<{ id: string }>();
  const courseUUID = id as string;

  const { laboratoriesDispatcher } = useContext(CourseLaboratoriesContext);

  const onSubmit = async (values: z.infer<typeof createLaboratorySchema>) => {
    setLoading(true);

    // Send the request
    const { success, message, laboratoryUUID } = await createLaboratoryService({
      ...values,
      courseUUID
    });
    if (!success) {
      toast.error(message);
      return;
    }

    setLoading(false);
    toast.success("The laboratory has been created successfully");
    closeDialogCallback();

    laboratoriesDispatcher({
      type: courseLaboratoriesActionType.ADD_LABORATORY,
      payload: {
        laboratory: {
          uuid: laboratoryUUID,
          name: values.name,
          opening_date: values.openingDate,
          due_date: values.dueDate
        }
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="mb-4 grid grid-cols-4 items-center gap-x-4">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a name for the laboratory here..."
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
          name="openingDate"
          render={({ field }) => (
            <FormItem className="mb-4 grid grid-cols-4 items-center gap-x-4">
              <FormLabel>Opening date</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="datetime-local"
                  className="col-span-3"
                />
              </FormControl>
              {form.formState.errors.openingDate && (
                <FormMessage className="col-span-3 col-start-2">
                  {form.formState.errors.openingDate.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="mb-4 grid grid-cols-4 items-center gap-x-4">
              <FormLabel>Closing date</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="datetime-local"
                  className="col-span-3"
                />
              </FormControl>
              {form.formState.errors.dueDate && (
                <FormMessage className="col-span-3 col-start-2">
                  {form.formState.errors.dueDate.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit" isLoading={loading}>
            Create
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
