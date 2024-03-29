import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { registerStudentService } from "@/services/accounts/register-student.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";

const RegisterStudentSchema = z.object({
  full_name: z
    .string()
    .min(4, "Full name must be at least 4 characters long")
    .max(255, "Full name must be at most 255 characters long"),
  email: z.string().email().endsWith("@upb.edu.co", "Must be an UPB email"),
  institutional_id: z.string().min(6).max(9).regex(/\d/, "Must be numeric"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(255, "Password must be at most 255 characters long")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[A-Za-z\d[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/,
      "Must contain at least one letter, one number and one special character"
    ),
  accept_terms: z.boolean().refine((value) => !!value, {
    message: "You can't register without accepting the terms and conditions"
  })
});

export const RegisterStudentForm = () => {
  const [state, setState] = useState<"idle" | "loading">("idle");
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof RegisterStudentSchema>>({
    resolver: zodResolver(RegisterStudentSchema),
    defaultValues: {
      full_name: "",
      email: "",
      institutional_id: "",
      password: "",
      accept_terms: false
    }
  });

  const onSubmit = async (values: z.infer<typeof RegisterStudentSchema>) => {
    setState("loading");

    const response = await registerStudentService(values);
    if (response.success) {
      toast.success(response.message);
      form.reset();
      navigate("/login");
    } else {
      toast.error(response.message);
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
          Register as an student
        </h1>
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name here..." {...field} />
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
                <Input placeholder="Enter your email here..." {...field} />
              </FormControl>
              {form.formState.errors.email && (
                <FormMessage>{form.formState.errors.email.message}</FormMessage>
              )}
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={form.control}
          name="institutional_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Institutional ID</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your institutional ID here..."
                  {...field}
                />
              </FormControl>
              {form.formState.errors.institutional_id && (
                <FormMessage>
                  {form.formState.errors.institutional_id.message}
                </FormMessage>
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
                  placeholder="Enter your password here..."
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
        <FormField
          control={form.control}
          name="accept_terms"
          render={({ field }) => (
            <FormItem>
              <div className="items-top flex space-x-2">
                <FormControl>
                  <Checkbox
                    id="terms1"
                    checked={field.value}
                    onCheckedChange={() => field.onChange(!field.value)}
                  />
                </FormControl>
                <div className="grid space-y-1.5">
                  <FormLabel htmlFor="terms1">
                    Accept terms and conditions
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    By checking this box, you agree to{" "}
                    <a
                      href="/POLITICA_TRATAMIENTO_INFORMACION_PROTECCION_DATOS_PERSONALES.pdf"
                      target="_blank"
                      rel="noreferrer,noopener"
                      className="text-red-upb underline"
                    >
                      our terms and conditions.
                    </a>
                  </p>
                </div>
              </div>
              {form.formState.errors.accept_terms && (
                <FormMessage>
                  {form.formState.errors.accept_terms.message}
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
