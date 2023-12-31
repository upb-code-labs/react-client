import { EditLaboratoryContext } from "@/context/laboratories/EditLaboratoryContext";
import { EditLaboratoryActionType } from "@/hooks/laboratories/editLaboratoryTypes";
import { updateLaboratoryDetailsService } from "@/services/laboratories/update-laboratory-details.service";
import { getTeacherRubricsService } from "@/services/rubrics/get-teacher-rubrics.service";
import { LaboratoryBaseInfo } from "@/types/entities/laboratory-entities";
import { CreatedRubric } from "@/types/entities/rubric-entities";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useContext, useEffect, useState } from "react";
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

  const handleSubmit = async (data: z.infer<typeof editLaboratoryScheme>) => {
    setIsUpdating(true);

    const { success, message } = await updateLaboratoryDetailsService({
      laboratoryUUID: laboratoryDetails.uuid,
      name: data.name,
      due_date: data.dueDate,
      opening_date: data.openingDate,
      rubric_uuid: data.rubricUUID
    });

    if (!success) {
      toast.error(message);
    } else {
      toast.success(message);
      laboratoryStateDispatcher({
        type: EditLaboratoryActionType.UPDATE_LABORATORY_DATA,
        payload: {
          name: data.name,
          due_date: data.dueDate,
          opening_date: data.openingDate,
          rubricUUID: data.rubricUUID
        }
      });
    }

    setIsUpdating(false);
  };

  // Rubrics state
  const [rubrics, setRubrics] = useState<CreatedRubric[]>([]);
  useEffect(() => {
    const fetchTeacherRubrics = async () => {
      const { success, rubrics, message } = await getTeacherRubricsService();
      if (!success) {
        toast.error(message);
        return;
      }

      setRubrics(rubrics);
    };

    fetchTeacherRubrics();
  }, []);

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
                    {rubrics.map((rubric) => (
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
