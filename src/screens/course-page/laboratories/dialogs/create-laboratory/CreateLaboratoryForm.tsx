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
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
    closingDate: z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
        "You must select a valid closing date"
      )
  })
  .refine(
    (data) => {
      const openingDate = new Date(data.openingDate);
      const closingDate = new Date(data.closingDate);
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
      closingDate: ""
    }
  });

  const onSubmit = (values: z.infer<typeof createLaboratorySchema>) => {
    setLoading(true);
    console.log(values);
    setLoading(false);
    // closeDialogCallback();
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
          name="closingDate"
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
              {form.formState.errors.closingDate && (
                <FormMessage className="col-span-3 col-start-2">
                  {form.formState.errors.closingDate.message}
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
