import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { supabaseClient } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@supabase/auth-helpers-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const profilePasswordFormSchema = z
  .object({
    password: z.string().max(30, {
      message: "Password must not be longer than 30 characters.",
    }),
    new_password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .max(30, {
        message: "Password must not be longer than 30 characters.",
      }),
    new_password_confirm: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .max(30, {
        message: "Password must not be longer than 30 characters.",
      }),
  })
  .refine((data) => data.new_password === data.new_password_confirm, {
    message: "Passwords doesn't match.",
    path: ["new_password_confirm"],
  });

const passwordErrorMessageEnums = {
  invalid_new_password: ["new_password", "Invalid new password."],
  minimum_8_chars_new_password: [
    "new_password",
    "Password must be at least 8 characters.",
  ],
  invalid_current_password: ["password", "Invalid current password."],
  "invalid salt": ["password", "This account not using password login."],
};

const ProfilePasswordForm = () => {
  const user = useUser();

  const isUserHasPassword = useMemo(() => {
    if (!user) return false;
    if (user?.app_metadata?.providers.includes("email")) return true;
    if (user?.app_metadata?.provider === "email") return true;

    return false;
  }, [user]);

  const { currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const [resettingPassword, setResettingPassword] = useState(false);

  const defaultValues = {
    password: "",
    new_password: "",
    new_password_confirm: "",
  };

  const form = useForm({
    resolver: zodResolver(profilePasswordFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    setResettingPassword(true);
    const { data, error } = await supabaseClient.rpc("change_user_password", {
      current_plain_password: values.password,
      new_plain_password: values.new_password,
    });

    if (error) {
      const [field, message] = passwordErrorMessageEnums[error.message] || [
        "",
        error.message,
      ];
      setResettingPassword(false);
      toast({
        title: "Failed to reset password",
        description: message,
      });
      form.setError(field, { message });
      return;
    }

    setResettingPassword(false);
    toast({
      title: "Password updated.",
      description: "Your password has been updated.",
    });
    form.reset({});
  };

  if (!isUserHasPassword) {
    return null;
  }

  if (isLoadingUser) {
    return (
      <>
        <div className="mb-8 mt-8 border-t border-muted pt-8">
          <Skeleton className="h-5 w-[150px] rounded-full bg-foreground/10 mb-3" />
          <Skeleton className="h-5 w-[300px] rounded-full bg-foreground/10 mb-3" />
        </div>

        <hr className="border-muted my-5" />

        <div className="grid grid-cols-2 gap-x-5 gap-y-4">
          <Skeleton className="h-8 w-full rounded-full bg-foreground/10 mb-3" />
          <Skeleton className="h-8 w-full rounded-full bg-foreground/10 mb-3" />
          <Skeleton className="h-8 w-full rounded-full bg-foreground/10 mb-3" />
        </div>

        <div className="mt-6 flex items-center space-x-4">
          <Skeleton className="h-8 w-[100px] rounded-full bg-foreground/10 mb-3" />
          <Skeleton className="h-8 w-[100px] rounded-full bg-foreground/10 mb-3" />
        </div>
      </>
    );
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="border-t border-muted py-5 mt-10"
      >
        <p className="font-semibold text-lg">Your password</p>
        <p className="text-muted-foreground">
          Please enter your current password to save your password.
        </p>

        <hr className="border-muted my-5" />

        <div className="grid grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Current password..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="new_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="New password..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="new_password_confirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm new password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm new password..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex space-x-4 mt-8">
          <Button variant="outline" type="reset">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="secondary"
            disabled={resettingPassword}
          >
            Update password
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfilePasswordForm;
