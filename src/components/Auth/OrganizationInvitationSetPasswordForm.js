import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import LucideIcon from "@/components/LucideIcon";
import { supabaseClient } from "@/lib/supabase";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";

// Define a Zod schema for the form validation
const organizationInvitationSetPasswordFormSchema = z
  .object({
    email: z.string(),
    password: z.string(),
  })
  .refine(({ password }) => /[a-z]/.test(password), {
    path: ["password", "lowercase"],
    message: "Password must have at least one lowercase letter",
  })
  .refine(({ password }) => /[A-Z]/.test(password), {
    path: ["password", "uppercase"],
    message: "Password must have at least one uppercase letter",
  })
  .refine(({ password }) => /\d/.test(password), {
    path: ["password", "number"],
    message: "Password must have at least one number",
  })
  .refine(({ password }) => password.length >= 8, {
    path: ["password", "length"],
    message: "Password must be at least 8 characters",
  });

const passwordCombinations = [
  ["lowercase", "Lowercase characters"],
  ["uppercase", "Uppercase characters"],
  ["number", "Numbers"],
  ["length", "8 characters minimum"],
];

export function OrganizationInvitationSetPasswordForm({
  onSubmit,
  organization,
}) {
  const { currentUser } = useCurrentUser();
  const [resettingPassword, setResettingPassword] = useState(false);

  const defaultValues = { email: currentUser?.email, password: "" };

  const form = useForm({
    resolver: zodResolver(organizationInvitationSetPasswordFormSchema),
    defaultValues,
    reValidateMode: "onChange",
    criteriaMode: "all",
  });

  // Submit handler for the form
  const onResetPassword = async (values) => {
    setResettingPassword(true);

    try {
      const { data, error } = await supabaseClient.auth.updateUser({
        password: values.password,
      });

      if (error) throw error;

      setResettingPassword(false);
      toast({
        title: "Password saved.",
        description: "Your password has been saved.",
      });

      onSubmit && onSubmit();
    } catch (error) {
      setResettingPassword(false);
      toast({
        title: "Failed to set password",
        description: error.message,
      });
      form.setError("password", { message: error.message });
      return;
    }

    onSubmit && onSubmit();
  };

  return (
    <>
      <h2 className="text-3xl font-regular mb-4">
        Welcome! <br />
        Join {organization?.name} to Ijin.
      </h2>
      <p className="mb-8 text-md">
        Ijin is an in-browser tool to design, buy, and manage commercial kitchen
        spaces at scale.
      </p>

      <Form {...form} className="w-full h-full">
        <form
          onSubmit={form.handleSubmit(onResetPassword)}
          className="flex flex-col w-full items-center space-y-3 py-2"
        >
          <FormField
            className="w-full"
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="pt-1">Email</FormLabel>
                <div className="w-full">
                  <FormControl className="">
                    <Input
                      readOnly
                      type="email"
                      placeholder="Type email address..."
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="mt-3" />
                </div>
              </FormItem>
            )}
          />

          <FormField
            className="w-full"
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="pt-1">Create password</FormLabel>
                <div className="w-full">
                  <FormControl className="">
                    <Input
                      type="password"
                      placeholder="Create password..."
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-5 text-sm w-full py-5">
            {passwordCombinations.map(([key, combination], index) => {
              const error = form.formState.errors.password?.[key];

              return (
                <div key={combination} className="flex items-center">
                  <span
                    className={cn(
                      "w-2 h-2 bg-gray-300 rounded-full flex-none mr-2",
                      { "bg-primary text-accent": !error }
                    )}
                  />
                  <p>{combination}</p>
                </div>
              );
            })}
          </div>

          <div className="w-full mt-5">
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={form.formState.errors.password || resettingPassword}
            >
              {resettingPassword && (
                <LucideIcon
                  name="loader-2"
                  className="mr-1 h-4 w-4 animate-spin"
                />
              )}
              Log in
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
