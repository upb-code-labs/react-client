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
import { registerTeacherService } from "@/services/accounts/register-teacher.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const RegisterTeacherSchema = z.object({
  full_name: z
    .string()
    .min(4, "Full name must be at least 4 characters long")
    .max(255, "Full name must be at most 255 characters long"),
  email: z.string().email().endsWith("@upb.edu.co", "Must be an UPB email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(255, "Password must be at most 255 characters long")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[A-Za-z\d[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/,
      "Must contain at least one letter, one number and one special character"
    )
});

export const RegisterTeacherForm = () => {
  const [state, setState] = useState<"idle" | "loading">("idle");

  const form = useForm<z.infer<typeof RegisterTeacherSchema>>({
    resolver: zodResolver(RegisterTeacherSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof RegisterTeacherSchema>) => {
    setState("loading");

    const { success, message } = await registerTeacherService(values);
    if (success) {
      toast.success(message);
      form.reset();
    } else {
      toast.error(message);
    }

    setState("idle");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto my-4 max-w-md space-y-4 border p-4 shadow-sm"
      >
        <h1 className="text-center text-3xl font-semibold tracking-tight">
          Register a new teacher
        </h1>
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter teacher's full name here..."
                  {...field}
                />
              </FormControl>
              {form.formState.errors.full_name && (
                <FormMessage>
                  {form.formState.errors.full_name.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter teacher's email here..."
                  required
                  {...field}
                />
              </FormControl>
              {form.formState.errors.email && (
                <FormMessage>{form.formState.errors.email.message}</FormMessage>
              )}
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter initial teacher's password here..."
                  {...field}
                />
              </FormControl>
              {form.formState.errors.password && (
                <FormMessage>
                  {form.formState.errors.password.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        ></FormField>
        <Button
          type="submit"
          className="w-full"
          isLoading={state === "loading"}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};
