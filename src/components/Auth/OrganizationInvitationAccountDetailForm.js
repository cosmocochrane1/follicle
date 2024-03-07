import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import useUpdateCurrentUser from "@/lib/hooks/actions/useUpdateCurrentUser";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
import { useScopes } from "@/lib/hooks/useScopes";
import { upload, uploadImage } from "@/lib/storage";
import Image from "next/image";
import { GenericAvatar } from "@/components/GenericAvatar";

// Define a Zod schema for the form validation
const organizationInvitationAccountDetailFormSchema = z.object({
  avatar_url: z.any().optional(),
  full_name: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  scope_access: z
    .string({
      required_error: "Please select a scope.",
    })
    .min(1, {
      message: "Please select a scope.",
    }),
});

export function OrganizationInvitationAccountDetailForm({
  organization,
  onContinue,
}) {
  const { currentUser, isLoading: isLoadingCurrentUser } = useCurrentUser();
  const { updateUser, isLoading: isUpdatingUser } = useUpdateCurrentUser();
  const { scopes, isLoading: isLoadingScopes } = useScopes();
  const [uploading, setUploading] = useState(false);

  const scopeAccess = useMemo(() => {
    if (!currentUser) return null;
    if (!organization) return null;

    const matchingOrganization = currentUser?.organizations?.find(
      (org) => org.id == organization.id,
    );

    const matchingProfile = matchingOrganization?.profiles?.find(
      (profile) => profile.id === currentUser.id,
    );

    const matchingScope = matchingProfile?.scope?.find(
      (scope) =>
        scope.profile_id === currentUser.id &&
        scope.organization_id === organization.id,
    );

    return matchingScope?.scope_access;
  }, [organization, currentUser, isLoadingCurrentUser]);

  const defaultValues =
    isLoadingCurrentUser || !scopeAccess
      ? { full_name: "", scope: "", avatar_url: "" }
      : {
          full_name: currentUser?.full_name,
          scope_access: scopeAccess,
          avatar_url: currentUser?.avatar_url,
        };

  const form = useForm({
    resolver: zodResolver(organizationInvitationAccountDetailFormSchema),
    defaultValues,
    reValidateMode: "onChange",
    criteriaMode: "all",
  });

  const handleUpdateAccount = async (data) => {
    try {
      await updateUser({
        email: data.email,
        full_name: data.full_name,
        avatar_url: data.avatar_url,
      });
      toast({
        title: "Account updated",
        description: "Please wait, you'll be redirected to dashboard.",
      });
    } catch (error) {
      toast({
        title: "Failed to update user",
        description: error.message,
      });
    }
  };

  // Submit handler for the form
  const onSubmit = async (values) => {
    await handleUpdateAccount(values);
    onContinue && onContinue();
  };

  const handleUploadAvatar = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const uploaded = await uploadImage(file, "profiles", `${currentUser.id}/`);

    try {
      form.setValue("avatar_url", uploaded.publicUrl);
      setUploading(false);
    } catch (error) {
      toast({
        title: "Failed to upload image",
        description: error.message,
      });
      setUploading(false);
    }
  };

  return (
    <>
      <Form {...form} className="w-full h-full">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col w-full space-y-3 py-2"
        >
          <h2 className="text-4xl text-left mb-5">Let's get started</h2>
          <div className="flex space-x-2 w-full border p-3 rounded-lg">
            <div
              className={`relative cursor-pointer hover:opacity-80 rounded-sm w-12 h-12 bg-gray-300 overflow-hidden`}
            >
              {organization?.thumbnail_url ? (
                <Image
                  src={organization?.thumbnail_url}
                  fill
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{organization?.name}</span>
              )}
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Joining:</p>
              <p>{organization?.name}</p>
            </div>
          </div>

          <div className="pt-4">
            <FormField
              className="w-full"
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Full name</FormLabel>
                  <div className="w-full">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Type your full name..."
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="mt-3" />
                  </div>
                </FormItem>
              )}
            />
          </div>

          <FormField
            className="w-full"
            control={form.control}
            name="scope_access"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="">Scope</FormLabel>
                <FormControl className="w-full">
                  <div className="w-full flex-2">
                    <FormControl>
                      <Select
                        disabled
                        value={field.value}
                        onValueChange={(value) =>
                          field.onChange({
                            target: { name: field.name, value },
                          })
                        }
                      >
                        <SelectTrigger className="truncate capitalize">
                          <SelectValue>
                            {!isLoadingScopes &&
                              (scopes?.find(
                                (scope) => scope.access === field.value,
                              )?.access ||
                                "Select scope")}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {scopes?.map((scope) => (
                            <SelectItem
                              key={scope.access}
                              value={scope.access}
                              className="truncate capitalize"
                            >
                              {scope.access}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="mt-3" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            className="w-full"
            control={form.control}
            name="avatar_url"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Upload an avatar</FormLabel>
                <FormControl className="w-full">
                  <div className="flex">
                    <div className="shrink pr-4">
                      <Button
                        variant="ghost"
                        type="button"
                        className="rounded-full p-0 m-0 h-16 w-16 "
                      >
                        <GenericAvatar
                          src={field.value}
                          email={currentUser?.email || "fallback"}
                        />
                      </Button>
                    </div>
                    <div className="flex flex-col items-start space-y-3 w-full">
                      <Input
                        onChange={handleUploadAvatar}
                        variant="dragDrop"
                        type="file"
                        accept=".jpg, .png, .gif"
                        placeholder="Avatar image..."
                        className="w-full"
                      />
                      <p className="text-xs">
                        At least 800x800 px recommended. JPG or PNG and GIF is
                        allowed
                      </p>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-full mt-5">
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={
                form.formState.errors.password || isUpdatingUser || uploading
              }
            >
              {isUpdatingUser && (
                <LucideIcon
                  name="loader-2"
                  className="mr-1 h-4 w-4 animate-spin"
                />
              )}
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
