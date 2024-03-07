import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { GenericAvatar } from "@/components/GenericAvatar";
import { Skeleton } from "@/components/ui/skeleton";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItemIndicator,
} from "@/components/ui/dropdown-menu";
import { useScopes } from "@/lib/hooks/useScopes";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useProfiles } from "@/lib/hooks/useProfiles";
import useUpdateOrganizationAccess from "@/lib/hooks/actions/useUpdateOrganizationAccess";
import { useCurrentOrganization } from "@/lib/hooks/useCurrentOrganization";
import { hasOrganizationAccess } from "@/lib/access";
import useInviteUser from "@/lib/hooks/actions/useInviteUser";
import LucideIcon from "../../LucideIcon";

// Define a Zod schema for the form validation
const inviteSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export function TeamInviteUserForm() {
  const { toast } = useToast();
  const { inviteUser, isLoading: isInviteUserLoading } = useInviteUser();
  const { currentOrganization, isLoading: isCurrentOrganizationLoading } =
    useCurrentOrganization();
  const { currentUser } = useCurrentUser();
  const { scopes, isLoading: isLoadingScopes } = useScopes();
  const {
    updateProfileOrganizationAccess,
    isLoading: isLoadingProfileDocumentAccess,
  } = useUpdateOrganizationAccess();
  const [removeUserId, setRemoveUserId] = useState(null);
  const { profiles, isLoading: isLoadingProfiles } = useProfiles();
  const form = useForm({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
    },
  });

  const onAccessChange = (profile, scopeAccess) => {
    if (!profile)
      return toast({
        title: "Uh oh! Something went wrong.",
        description: "Please select a profile to update.",
      });
    if (!scopeAccess)
      return toast({
        title: "Uh oh! Something went wrong.",
        description: "Please select a scope to update.",
      });
    updateProfileOrganizationAccess({
      profile_id: profile.id,
      organization_id: currentOrganization.id,
      scopeAccess,
    });
  };

  // Submit handler for the form
  const onSubmit = (values) => {
    inviteUser({ email: values.email });
  };

  const isLoading =
    isLoadingProfiles ||
    isLoadingProfileDocumentAccess ||
    isLoadingScopes ||
    isCurrentOrganizationLoading ||
    isInviteUserLoading;
  const accessLevel =
    currentOrganization &&
    currentUser &&
    hasOrganizationAccess(currentOrganization, currentUser?.id);
  const canEdit =
    (accessLevel && (accessLevel === "admin" || accessLevel === "write")) ||
    false;
  // const canEdit = profiles?.find((user) => user?.id === currentUser?.id)?.scope?.scope_access === 'admin'  || profiles?.find((user) => user?.id === currentUser?.id)?.scope?.scope_access === 'write' || false;
  return (
    <Form {...form} className="w-full">
      {canEdit && (
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full items-center space-x-2 py-2"
        >
          <FormField
            className="w-full"
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="w-full">
                  <div className="flex w-full items-center space-x-2">
                    <Input
                      type="email"
                      placeholder="Email"
                      className="w-full"
                      {...field}
                    />
                    <Button disabled={isLoadingProfiles} type="submit">
                      {" "}
                      {isLoadingProfiles ? (
                        <LucideIcon
                          name="loader-2"
                          className="mr-1 h-4 w-4 animate-spin"
                        />
                      ) : (
                        <LucideIcon name="plus" className="mr-1 h-4 w-4" />
                      )}{" "}
                      Invite
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      )}
      <ul className="flex flex-col space-y-2">
        {isLoading &&
          [...Array(1)].map((_, i) => {
            return (
              <div
                className="flex w-full pt-3 items-center justify-center"
                key={i}
              >
                <Skeleton className="h-8 w-8 rounded-full bg-foreground/10" />
                <div className="w-full pl-2 flex flex-col items-center justify-center space-y-1">
                  <Skeleton className="h-6 w-full rounded-full bg-foreground/10" />
                  <Skeleton className="h-4 w-full rounded-full bg-foreground/10" />
                </div>
              </div>
            );
          })}
        {!isLoading &&
          scopes &&
          profiles &&
          profiles.length > 0 &&
          profiles.map((user) => {
            const userAccess =
              user?.scope_access || user?.scope?.access || "read";
            const isYou = user?.id === currentUser?.id || false;
            const canUserEdit =
              isYou && userAccess == "admin" && userAccess === "write";
            const isOwner = user?.id === currentOrganization.owner_id;
            return (
              <div
                key={user.id}
                className="flex w-full items-center space-x-2 pt-3"
              >
                <div>
                  <GenericAvatar src={user.avatar_url} email={user.email} />
                </div>
                <div className="pl-1 flex-1">
                  <h4 className="pb-0 text-sm capitalize">
                    {user?.username || user?.full_name || user?.email}
                    {isYou && (
                      <Badge className="text-xs ml-1 p-0 px-2">You</Badge>
                    )}
                    {isOwner && (
                      <Badge className="text-xs ml-1 p-0 px-2">Owner</Badge>
                    )}
                  </h4>
                  <div className="flex items-center">
                    <p className="pt-0 text-xs font-normal text-foreground/50">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <DropdownMenu disabled={!canEdit || isOwner}>
                  <DropdownMenuTrigger asChild disabled={!canEdit || isOwner}>
                    <Button
                      disabled={!canEdit || isOwner}
                      variant="outline"
                      className="w-[145px] flex items-center justify-between font-normal capitalize"
                    >
                      {userAccess}{" "}
                      <LucideIcon
                        name="chevron-down"
                        className="ml-2 h-4 w-4 shrink-0 opacity-50"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[145px]">
                    {!isYou && (
                      <DropdownMenuRadioGroup
                        value={userAccess}
                        onValueChange={(value) => {
                          // handleUpdateDocumentUser(user.email, value);
                          onAccessChange(user, value);
                        }}
                      >
                        {scopes.map((scope) => {
                          return (
                            <DropdownMenuRadioItem
                              value={scope.access}
                              key={scope.access}
                              className="capitalize cursor-pointer"
                            >
                              {scope.access}
                            </DropdownMenuRadioItem>
                          );
                        })}
                      </DropdownMenuRadioGroup>
                    )}
                    {isYou && (
                      <DropdownMenuRadioGroup disabled value={userAccess}>
                        {scopes.map((scope) => {
                          if (scope.access !== userAccess) return null;
                          return (
                            <DropdownMenuRadioItem
                              value={scope.access}
                              key={scope.access}
                              className="capitalize cursor-pointer"
                            >
                              {scope.access}
                            </DropdownMenuRadioItem>
                          );
                        })}
                      </DropdownMenuRadioGroup>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive cursor-pointer"
                      onClick={() => {
                        setRemoveUserId(user.id);
                      }}
                    >
                      <LucideIcon name="user-x" className="mr-2 w-4 h-4" />{" "}
                      {isYou ? "Leave" : "Remove"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          })}
      </ul>
    </Form>
  );
}
