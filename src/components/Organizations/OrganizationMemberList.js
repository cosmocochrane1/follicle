import { GenericAvatar } from "@/components/GenericAvatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import LucideIcon from "@/components/LucideIcon";
import { useProfiles } from "@/lib/hooks/useProfiles";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useScopes } from "@/lib/hooks/useScopes";
import { useCurrentOrganization } from "@/lib/hooks/useCurrentOrganization";
import useUpdateOrganizationAccess from "@/lib/hooks/actions/useUpdateOrganizationAccess";
import { hasOrganizationAccess } from "@/lib/access";
import useRevokeOrganizationAccess from "@/lib/hooks/actions/useRevokeOrganizationAccess";
import { toast } from "@/components/ui/use-toast";
import { useMemo } from "react";

const OrganizationMemberList = () => {
  const { profiles, isLoading: isLoadingProfiles } = useProfiles();
  const { currentOrganization, isLoading: isOrganizationLoading } =
    useCurrentOrganization();
  const { currentUser, isLoading: isCurrentUserLoading } = useCurrentUser();
  const { scopes, isLoading: isLoadingScopes } = useScopes();
  const {
    updateProfileOrganizationAccess,
    isLoading: isLoadingProfileOrganizationAccess,
  } = useUpdateOrganizationAccess();
  const {
    revokeProfileOrganizationAccess,
    isLoading: isLoadingRevokeProfileOrganizationAccess,
    error: revokeProfileOrganizationAccessError,
  } = useRevokeOrganizationAccess();

  const isProcessing =
    isLoadingProfileOrganizationAccess ||
    isLoadingRevokeProfileOrganizationAccess;

  const onAccessChange = async (profile, scopeAccess) => {
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

    try {
      await updateProfileOrganizationAccess({
        profile_id: profile.id,
        organization_id: currentOrganization.id,
        scopeAccess,
      });

      toast({
        title: "User scope updated",
        description: `User scope has been updated.`,
      });
    } catch (error) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: error.message || "Please try again.",
      });
    }
  };

  const onRevokeAccess = async (profile) => {
    if (!profile)
      return toast({
        title: "Uh oh! Something went wrong.",
        description: "Please select a profile to revoke.",
      });

    try {
      await revokeProfileOrganizationAccess({
        profile_id: profile.id,
        organization_id: currentOrganization.id,
      });

      toast({
        title: "User revoked",
        description: `User has been revoked.`,
      });
    } catch (error) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: error.message || "Please try again.",
      });
    }
  };

  const organizationAccess = useMemo(
    () =>
      currentOrganization &&
      currentUser &&
      !isCurrentUserLoading &&
      !isOrganizationLoading
        ? hasOrganizationAccess(currentOrganization, currentUser.id)
        : false,
    [
      currentOrganization,
      currentUser,
      isCurrentUserLoading,
      isOrganizationLoading,
    ]
  );

  const canEditOrganization = useMemo(
    () => organizationAccess === "admin",
    [organizationAccess]
  );

  return (
    <div className="flex items-start py-6">
      <div className="w-[400px]">
        <p>Existing team members</p>
      </div>
      <div className="w-full">
        {isLoadingProfiles &&
          [...Array(2)].map((_, i) => {
            return (
              <div
                className="flex w-full pt-3 items-center justify-center"
                key={i}
              >
                <Skeleton className="flex-none h-12 w-12 rounded-full bg-foreground/10" />
                <div className="w-full pl-2 flex items-start justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-[200px] rounded-full bg-foreground/10" />
                    <Skeleton className="h-4 w-[100px] rounded-full bg-foreground/10" />
                  </div>
                  <Skeleton className="h-10 w-[100px] rounded-full bg-foreground/10" />
                </div>
              </div>
            );
          })}
        {!isLoadingProfiles &&
          profiles?.map((user) => {
            const userAccess =
              user?.scope_access || user?.scope?.access || "read";
            const isYou = user?.id === currentUser?.id || false;
            const isOwner = user?.id === currentOrganization?.owner_id;
            return (
              <div key={user.email} className="flex w-full mb-4">
                <div className="flex justify-between items-center space-x-3">
                  <GenericAvatar
                    className="h-10 w-10"
                    src={user.avatar_url}
                    email={user.email}
                  />

                  <div>
                    <p className="text-foreground text-sm">
                      {user?.username || user?.full_name || user?.email}
                    </p>
                    <p className="text-sm text-muted-foreground">Role</p>
                  </div>
                </div>
                <div className="ml-auto flex items-center">
                  <Select
                    value={userAccess}
                    onValueChange={(newScope) => {
                      onAccessChange(user, newScope);
                    }}
                    disabled={!canEditOrganization}
                  >
                    <SelectTrigger className="truncate capitalize w-[100px]">
                      <SelectValue>
                        {scopes?.find((scope) => scope.access === userAccess)
                          ?.access || "Select scope"}
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

                  {!isYou && canEditOrganization && (
                    <Button
                      variant="icon"
                      className="border border-muted ml-4"
                      onClick={() => onRevokeAccess(user)}
                      disabled={isProcessing}
                    >
                      <LucideIcon name="trash" className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default OrganizationMemberList;
