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
import { ProjectInviteComboBox } from "./ProjectInviteComboBox";
import { useProfiles } from "@/lib/hooks/useProfiles";
import useInviteProfileToProject from "@/lib/hooks/actions/useInviteProfileToProject";
import useUpdateProjectAccess from "@/lib/hooks/actions/useUpdateProjectAccess";
import { ProjectRemoveUserDialog } from "./ProjectRemoveUserDialog";
import LucideIcon from "../../LucideIcon";

const selectOptions = [
  {
    title: "Can edit",
    value: "write",
    description: "User can read, edit, and share the project",
  },
  {
    title: "Can read",
    value: "read",
    description: "User can only read the project",
  },
];

// Define a Zod schema for the form validation
const inviteSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export function ProjectInviteUserForm({ project }) {
  const { toast } = useToast();
  const { inviteProfileToProject, isLoading: isLoadingInviteProfile } =
    useInviteProfileToProject();
  const {
    updateProfileProjectAccess,
    isLoading: isLoadingProfileProjectAccess,
  } = useUpdateProjectAccess();
  const { currentUser, isLoading: isCurrenUserLoading } = useCurrentUser();
  const { scopes, isLoading: isLoadingScopes } = useScopes();
  const { profiles, isLoading: isLoadingProfiles } = useProfiles();
  const [userToRemove, setUserToRemove] = useState(null);
  const [projectUsersLoading, setProjectUsersLoading] = useState(false);
  const projectUsers = project.profiles || [];
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
    updateProfileProjectAccess({
      profile_id: profile.id,
      project_id: project.id,
      scopeAccess,
    });
  };

  // Submit handler for the form
  const onSubmit = (values) => {
    // handleInviteUser(values.email);
    const profile = profiles.find((profile) => profile.email === values.email);
    if (!profile)
      return toast({
        title: "Uh oh! Something went wrong.",
        description: "We couldnt find a profile associated with that email.",
      });
    inviteProfileToProject({
      profile_id: profile.id,
      project_id: project.id,
    });
  };

  const isLoading =
    isLoadingProfiles ||
    isLoadingScopes ||
    projectUsersLoading ||
    isLoadingInviteProfile ||
    isLoadingProfileProjectAccess ||
    isCurrenUserLoading;

  return (
    <Form {...form} className="w-full">
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
                  {/* <Input type="email" placeholder="Email" className="w-full"  {...field}/> */}
                  <ProjectInviteComboBox
                    placeholder="Invite Member..."
                    {...form}
                    {...field}
                    ref={null}
                  />
                  <Button disabled={isLoading} type="submit">
                    {" "}
                    {isLoading ? (
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
          projectUsers &&
          projectUsers.length > 0 &&
          projectUsers.map((user) => {
            const userAccess = user?.scope?.scope_access || "read";
            const isYou = user?.id === currentUser?.id || false;
            const isOwner = user?.id === project.created_by;
            // const isOwner = false;
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
                    {user?.username || user?.full_name || user?.email}{" "}
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

                <DropdownMenu disabled={isOwner}>
                  <DropdownMenuTrigger asChild disabled={isOwner}>
                    <Button
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
                          // handleUpdateProjectUser(user.email, value);
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
                        setUserToRemove(user);
                      }}
                    >
                      <LucideIcon name="user-x" className="mr-2 w-4 h-4" />{" "}
                      {isYou ? "Leave" : "Remove"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <ProjectRemoveUserDialog
                  user={userToRemove}
                  open={!!userToRemove}
                  onOpenChange={setUserToRemove}
                />
              </div>
            );
          })}
      </ul>
    </Form>
  );
}
