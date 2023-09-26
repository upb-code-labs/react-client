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
import { loginService } from "@/services/session/login.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export const LoginForm = () => {
  const { setContextUser } = useContext(AuthContext);
  const [state, setState] = useState<"idle" | "loading">("idle");
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    setState("loading");

    const response = await loginService(data);
    if (response.success && response.user) {
      toast.success(response.message);
      setContextUser(response.user);

      if (response.user.role === "admin") navigate("/admins");
      else navigate("/courses");
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
          Login
        </h1>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email here..."
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
                  placeholder="Enter your password here..."
                  required
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
