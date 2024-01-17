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
import { updatePasswordService } from "@/services/accounts/update-password.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const updatePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Required"),
    newPassword: z
      .string()
      .min(1, "Required")
      .max(255, "Must be at most 255 characters long")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[A-Za-z\d[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/,
        "Must contain at least one letter, one number and one special character"
      ),
    newPasswordConfirm: z.string().min(1, "Required")
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: "Passwords do not match",
    path: ["newPasswordConfirm"]
  });

export const UpdatePasswordForm = () => {
  // Form state
  const [isUpdating, setIsUpdating] = useState(false);
  const form = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      newPasswordConfirm: ""
    }
  });

  // Form submit handler
  const handleSubmit = async (data: z.infer<typeof updatePasswordSchema>) => {
    setIsUpdating(true);

    await updatePassword(data);

    form.reset();
    setIsUpdating(false);
  };

  const updatePassword = async (data: z.infer<typeof updatePasswordSchema>) => {
    const { success, message } = await updatePasswordService({
      old_password: data.oldPassword,
      new_password: data.newPassword
    });

    if (!success) {
      toast.error(message);
      return;
    }

    toast.success(message);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your current password here..."
                  type="password"
                  {...field}
                />
              </FormControl>
              {form.formState.errors.oldPassword && (
                <FormMessage>
                  {form.formState.errors.oldPassword.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your new password here..."
                  type="password"
                  {...field}
                />
              </FormControl>
              {form.formState.errors.newPassword && (
                <FormMessage>
                  {form.formState.errors.newPassword.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPasswordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm new password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Confirm your new password here..."
                  type="password"
                  {...field}
                />
              </FormControl>
              {form.formState.errors.newPasswordConfirm && (
                <FormMessage>
                  {form.formState.errors.newPasswordConfirm.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" isLoading={isUpdating}>
          Update
        </Button>
      </form>
    </Form>
  );
};
