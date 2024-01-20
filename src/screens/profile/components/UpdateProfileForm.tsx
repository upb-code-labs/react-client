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
import { AuthContext } from "@/context/AuthContext";
import { userProfile } from "@/services/accounts/get-user-profile.service";
import { updateProfileService } from "@/services/accounts/update-profile.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

interface UpdateProfileFormProps {
  profile: userProfile;
}

export const UpdateProfileForm = ({ profile }: UpdateProfileFormProps) => {
  const { full_name, email, institutional_id } = profile;

  // Global user state
  const { user } = useContext(AuthContext);
  const { role } = user!;

  // Update the schema according to the user's role
  const updateProfileSchema = z.object({
    full_name: z
      .string()
      .min(4, "Full name must be at least 4 characters long")
      .max(255, "Full name must be at most 255 characters long"),
    email: z
      .string()
      .email()
      .refine(
        (email) => {
          if (role === "teacher" || role === "student") {
            // Teachers and students must have an UPB email
            return email.endsWith("@upb.edu.co");
          } else {
            // Admins can have a domain from any email provider
            return true;
          }
        },
        { message: "Email must be an UPB email" }
      ),
    institutional_id: z.string().refine(
      (institutional_id) => {
        if (role === "teacher" || role === "admin") {
          // Teachers and admins don't require an institutional ID
          return institutional_id.length === 0;
        } else {
          // Students require an institutional ID
          const isNumeric = /^\d+$/.test(institutional_id);
          const hasCorrectLength =
            institutional_id.length >= 6 && institutional_id.length <= 9;
          return isNumeric && hasCorrectLength;
        }
      },
      {
        message:
          role === "teacher" || role === "admin"
            ? "This field is not required"
            : "Must be a valid institutional ID"
      }
    ),
    password_confirmation: z.string().min(1).max(255)
  });

  // Form state
  const [isUpdating, setIsUpdating] = useState(false);
  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      full_name,
      email,
      institutional_id
    }
  });

  // Handlers
  const handleSubmit = (data: z.infer<typeof updateProfileSchema>) => {
    updateProfileMutation({
      full_name: data.full_name,
      email: data.email,
      institutional_id: data.institutional_id,
      password: data.password_confirmation
    });
  };

  // Update profile mutation
  const queryClient = useQueryClient();
  const { mutate: updateProfileMutation } = useMutation({
    mutationFn: updateProfileService,
    onMutate: () => {
      setIsUpdating(true);
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess(_, args) {
      // Update the user profile in the cache
      queryClient.setQueryData<userProfile>(["user-profile"], {
        full_name: args.full_name,
        email: args.email,
        institutional_id: args.institutional_id || ""
      });

      // Show a confirmation toast
      toast.success("Your profile has been updated successfully");
    },
    onSettled() {
      setIsUpdating(false);
      form.setValue("password_confirmation", "");
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name here..." {...field} />
              </FormControl>
              {form.formState.errors.full_name &&
                typeof form.formState.errors.full_name.message === "string" && (
                  <FormMessage>
                    {form.formState.errors.full_name.message}
                  </FormMessage>
                )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email here..." {...field} />
              </FormControl>
              {form.formState.errors.email &&
                typeof form.formState.errors.email.message === "string" && (
                  <FormMessage>
                    {form.formState.errors.email.message}
                  </FormMessage>
                )}
            </FormItem>
          )}
        />
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
              {form.formState.errors.institutional_id &&
                typeof form.formState.errors.institutional_id.message ===
                  "string" && (
                  <FormMessage>
                    {form.formState.errors.institutional_id.message}
                  </FormMessage>
                )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password_confirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password confirmation</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your password confirmation here..."
                  type="password"
                  {...field}
                />
              </FormControl>
              {form.formState.errors.password_confirmation &&
                typeof form.formState.errors.password_confirmation.message ===
                  "string" && (
                  <FormMessage>
                    {form.formState.errors.password_confirmation.message}
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
