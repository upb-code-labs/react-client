import { EditLaboratoryContext } from "@/context/laboratories/EditLaboratoryContext";
import { EditLaboratoryActionType } from "@/hooks/laboratories/editLaboratoryTypes";
import { updateLaboratoryDetailsService } from "@/services/laboratories/update-laboratory-details.service";
import { getTeacherRubricsService } from "@/services/rubrics/get-teacher-rubrics.service";
import {
  Laboratory,
  LaboratoryBaseInfo
} from "@/types/entities/laboratory-entities";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "../../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../../components/ui/select";

const editLaboratoryScheme = z
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
      ),
    rubricUUID: z.string().uuid().nullable()
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

type LaboratoryDetails = LaboratoryBaseInfo & {
  rubricUUID: string | null;
};

interface CreateLaboratoryFormProps {
  laboratoryDetails: LaboratoryDetails;
}

export const LaboratoryDetails = ({
  laboratoryDetails
}: CreateLaboratoryFormProps) => {
  // Remove empty timezone from dates
  const openingDate = laboratoryDetails.opening_date.slice(0, -4);
  const dueDate = laboratoryDetails.due_date.slice(0, -4);

  // Global laboratory state
  const { laboratoryStateDispatcher } = useContext(EditLaboratoryContext);

  // Form state
  const [isUpdating, setIsUpdating] = useState(false);
  const form = useForm<z.infer<typeof editLaboratoryScheme>>({
    resolver: zodResolver(editLaboratoryScheme),
    defaultValues: {
      ...laboratoryDetails,
      rubricUUID: laboratoryDetails.rubricUUID,
      openingDate,
      dueDate
    }
  });

  // Update laboratory details mutation
  const queryClient = useQueryClient();
  const { mutate: updateLaboratoryMutation } = useMutation({
    mutationFn: updateLaboratoryDetailsService,
    onMutate: () => {
      setIsUpdating(true);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (_, { name, opening_date, due_date, rubric_uuid }) => {
      const openingDateWithDefaultTimeZone = `${opening_date}:00Z`;
      const dueDateWithDefaultTimeZone = `${due_date}:00Z`;

      // Update laboratory state
      laboratoryStateDispatcher({
        type: EditLaboratoryActionType.UPDATE_LABORATORY_DATA,
        payload: {
          name,
          opening_date: openingDateWithDefaultTimeZone,
          due_date: dueDateWithDefaultTimeZone,
          rubricUUID: rubric_uuid
        }
      });

      // Show success message
      toast.success("Laboratory details updated successfully");

      // Update laboratory query
      queryClient.setQueryData(
        ["laboratory", laboratoryDetails.uuid],
        (oldData: Laboratory) => {
          return {
            // Keep the UUID and blocks
            ...oldData,
            name,
            opening_date: openingDateWithDefaultTimeZone,
            due_date: dueDateWithDefaultTimeZone,
            rubric_uuid
          };
        }
      );
    },
    onSettled: () => {
      setIsUpdating(false);
    }
  });

  const handleSubmit = async (data: z.infer<typeof editLaboratoryScheme>) => {
    const { name, rubricUUID, openingDate, dueDate } = data;

    updateLaboratoryMutation({
      laboratoryUUID: laboratoryDetails.uuid,
      name,
      due_date: dueDate,
      opening_date: openingDate,
      rubric_uuid: rubricUUID
    });
  };

  // Rubrics state
  const {
    data: rubrics,
    isError: isTeacherRubricsError,
    error: TeacherRubricsError
  } = useQuery({
    queryKey: ["rubrics"],
    queryFn: getTeacherRubricsService
  });

  if (isTeacherRubricsError) {
    toast.error(TeacherRubricsError.message);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        {/* Laboratory name and save button */}
        <div className="flex items-end justify-between gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-grow sm:w-1/2 sm:flex-grow-0 lg:w-1/3">
                <FormLabel>Laboratory name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter a name for the laboratory here..."
                    className="w-full"
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
          <Button type="submit" isLoading={isUpdating}>
            <Save className="mr-2" /> Save changes
          </Button>
        </div>
        {/* Dates and rubric selection*/}
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormField
            control={form.control}
            name="openingDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opening date</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
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
              <FormItem>
                <FormLabel>Closing date</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                {form.formState.errors.dueDate && (
                  <FormMessage className="col-span-3 col-start-2">
                    {form.formState.errors.dueDate.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rubricUUID"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rubric</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a rubric from your rubrics list" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {rubrics?.map((rubric) => (
                      <SelectItem
                        key={`rubric-option-${rubric.uuid}`}
                        value={rubric.uuid}
                      >
                        {rubric.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.rubricUUID && (
                  <FormMessage className="col-span-3 col-start-2">
                    {form.formState.errors.rubricUUID.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};
