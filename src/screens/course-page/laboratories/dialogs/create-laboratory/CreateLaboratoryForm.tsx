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
import { createLaboratoryService } from "@/services/laboratories/create-laboratory.service";
import { LaboratoryBaseInfo } from "@/types/entities/laboratory-entities";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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
  const { courseUUID = "" } = useParams<{ courseUUID: string }>();

  // Form state
  const [isCreatingLab, setIsCreatingLab] = useState(false);

  const form = useForm<z.infer<typeof createLaboratorySchema>>({
    resolver: zodResolver(createLaboratorySchema),
    defaultValues: {
      name: "",
      openingDate: "",
      dueDate: ""
    }
  });

  // Create laboratory mutation
  const queryClient = useQueryClient();
  const { mutate: createLaboratoryMutation } = useMutation({
    mutationFn: createLaboratoryService,
    onMutate: (args) => {
      setIsCreatingLab(true);

      // Forward parameters to the following callbacks
      return args;
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (newLabUUID, args) => {
      const { name, openingDate, dueDate } = args;

      const newLaboratory: LaboratoryBaseInfo = {
        uuid: newLabUUID,
        name,
        opening_date: openingDate,
        due_date: dueDate
      };

      // Update the laboratories query
      queryClient.setQueryData(
        ["course-laboratories", courseUUID],
        (oldData: LaboratoryBaseInfo[]) => {
          return [...oldData, newLaboratory];
        }
      );

      // Show a success toast
      toast.success("The laboratory has been created successfully");

      // Close the dialog
      closeDialogCallback();
    },
    onSettled: () => {
      setIsCreatingLab(false);
    }
  });

  const onSubmit = async (values: z.infer<typeof createLaboratorySchema>) => {
    createLaboratoryMutation({
      courseUUID,
      ...values
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
          <Button type="submit" isLoading={isCreatingLab}>
            Create
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
