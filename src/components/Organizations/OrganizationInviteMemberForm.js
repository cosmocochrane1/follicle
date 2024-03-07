import LucideIcon from "@/components/LucideIcon";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { hasOrganizationAccess } from "@/lib/access";
import useGrantOrganizationAccess from "@/lib/hooks/actions/useGrantOrganizationAccess";
import useInviteUser from "@/lib/hooks/actions/useInviteUser";
import { useCurrentOrganization } from "@/lib/hooks/useCurrentOrganization";
import { useScopes } from "@/lib/hooks/useScopes";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const inviteTeamMemberFormSchema = z.object({
  members: z.array(
    z.object({
      email: z.string().email({
        message: "Please enter a valid email address.",
      }),
      scope: z.string().trim().min(1, {
        message: "Please select a scope.",
      }),
    })
  ),
});

const OrganizationInviteMemberForm = () => {
  const { inviteUser, isLoading: isInviteUserLoading } = useInviteUser();
  const { currentOrganization, isLoading: isOrganizationLoading } =
    useCurrentOrganization();
  const {
    grantProfileOrganizationAccess,
    isLoading: isLoadingGrantProfileOrganizationAccess,
    error: errorGrantProfileOrganizationAccess,
  } = useGrantOrganizationAccess();
  const { currentUser, isLoading: isCurrentUserLoading } = useCurrentUser();

  const { scopes, isLoading: isLoadingScopes } = useScopes();

  const form = useForm({
    resolver: zodResolver(inviteTeamMemberFormSchema),
    mode: "onChange",
  });

  const membersField = useFieldArray({
    name: "members",
    control: form.control,
  });

  const onSubmit = async (data) => {
    Promise.all(
      data.members.map(async (member) => {
        try {
          const invitedUser = await inviteUser({
            email: member.email,
          });

          if (invitedUser) {
            await grantProfileOrganizationAccess({
              profile_id: invitedUser.id,
              organization_id: currentOrganization.id,
              scopeAccess: member.scope,
            });
            toast({
              title: "User invited",
              description: `Invitation has been sent to ${member.email}.`,
            });
          }
        } catch (error) {
          throw error;
        }
      })
    )
      .then((res) => {
        form.reset();
      })
      .catch((error) => {
        toast({
          title: "Uh oh! Something went wrong.",
          description: error.message,
        });
      });
  };

  useEffect(() => {
    membersField.append({ email: "", scope: "" });

    return () => {
      membersField.remove();
    };
  }, []);

  const isLoading = isOrganizationLoading || isCurrentUserLoading;

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

  if (!canEditOrganization || isLoading) {
    return null;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="border-b border-muted py-6"
      >
        <div className="flex items-start">
          <div className="w-[400px]">
            <p>Invite team member</p>
          </div>

          <div className="w-full ml-auto">
            {membersField.fields.map((field, index) => (
              <div className="flex space-x-4 mb-4 w-full" key={field.id}>
                <FormField
                  control={form.control}
                  name={`members.${index}.email`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Type email address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`members.${index}.scope`}
                  render={({ field, ...props }) => (
                    <FormItem className="w-full max-w-[180px]">
                      <FormControl>
                        <Select
                          {...field}
                          ref={null}
                          value={field.value}
                          onValueChange={(value) => {
                            form.setValue(field.name, value, {
                              shouldValidate: true,
                            });
                          }}
                        >
                          <SelectTrigger className="truncate capitalize">
                            <SelectValue>
                              {scopes?.find(
                                (scope) => scope.access === field.value
                              )?.access || "Select scope"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {!isLoading &&
                              scopes?.map((scope) => (
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}

            <div className="flex justify-between w-full mt-4">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="w-full max-w-[150px]"
                onClick={() => membersField.append({ email: "", scope: "" })}
              >
                <LucideIcon name="plus" className="h-4 w-4" />
                <span className="ml-3">Add another</span>
              </Button>
              <Button
                type="submit"
                size="sm"
                className="w-full max-w-[150px]"
                disabled={isLoading}
              >
                {isLoading ||
                isInviteUserLoading ||
                isLoadingGrantProfileOrganizationAccess ||
                isLoadingScopes ? (
                  <LucideIcon
                    name="loader-2"
                    className="h-4 w-4  animate-spin"
                  />
                ) : (
                  <LucideIcon name="mail" className="h-4 w-4" />
                )}
                <span className="ml-3">Send invite</span>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default OrganizationInviteMemberForm;
