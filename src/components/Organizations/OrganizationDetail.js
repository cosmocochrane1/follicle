import LucideIcon from "@/components/LucideIcon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import useUpdateCurrentOrganization from "@/lib/hooks/actions/useUpdateCurrentOrganization";
import { useCurrentOrganization } from "@/lib/hooks/useCurrentOrganization";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { uploadImage } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEmpty } from "lodash";
import { useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { hasOrganizationAccess } from "@/lib/access";
import { useOrganizations } from "@/lib/hooks/useOrganizations";
import { GenericAvatar } from "../GenericAvatar";

const organizationDetailSchema = z.object({
  name: z.string().min(2, {
    message: "Team name must be at least 2 characters.",
  }),
});

const OrganizationDetail = () => {
  const inputAvatarImageRef = useRef(null);
  const { currentOrganization, isLoading: isLoadingCurrentOrganization } =
    useCurrentOrganization();
  const { updateOrganization, isLoading: isUpdateOrganizationLoading } =
    useUpdateCurrentOrganization();
  const { currentUser, isLoading: isCurrentUserLoading } = useCurrentUser();
  const { organizations, isLoading: isOrganizationsLoading } =
    useOrganizations();

  const isLoading = isCurrentUserLoading || isLoadingCurrentOrganization;

  const defaultValues = { name: isLoading ? "" : currentOrganization.name };
  const form = useForm({
    resolver: zodResolver(organizationDetailSchema),
    mode: "onChange",
    defaultValues,
  });

  const handleUploadAvatar = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const uploaded = await uploadImage(
      file,
      "organizations",
      `${currentOrganization.id}/`
    );
    try {
      await updateOrganization({ thumbnail_url: uploaded.publicUrl });
      toast({
        title: "Thumbnail updated",
        description: "Your organization thumbnail has been updated.",
      });
    } catch (error) {
      toast({
        title: "Failed to upload image",
        description: error.message,
      });
    }
  };

  const onSubmit = async (values) => {
    try {
      await updateOrganization({
        name: values.name,
      });
      toast({
        title: "Team updated",
        description: "Your team details has been updated.",
      });
    } catch (error) {
      toast({
        title: "Failed to update team details",
        description: error.message,
      });
    }
  };

  const organizationAccess = useMemo(
    () =>
      currentOrganization &&
      currentUser &&
      !isCurrentUserLoading &&
      !isOrganizationsLoading
        ? hasOrganizationAccess(currentOrganization, currentUser.id)
        : false,
    [organizations, currentOrganization, currentUser, isCurrentUserLoading]
  );

  const canEditOrganization = useMemo(
    () => organizationAccess === "admin",
    [organizationAccess]
  );

  if (isLoading) {
    return (
      <div className="flex items-start border-b border-muted pb-6">
        <div className="w-full">
          <Skeleton className="h-8 w-[300px] rounded-full bg-foreground/10 mb-3" />
          <Skeleton className="h-5 w-[300px] rounded-full bg-foreground/10 mb-3" />
        </div>
        <div className="max-w-[500px] w-full ml-auto">
          <div className="flex items-center space-x-5">
            <div className="h-20 w-20 flex-none rounded-full bg-foreground/10" />
            <div className="w-full">
              <Skeleton className="h-8 w-[300px] rounded-full bg-foreground/10 mb-3" />
              <Skeleton className="h-5 w-[300px] rounded-full bg-foreground/10 mb-3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Form {...form} className="w-full h-full">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-3xl">Team settings</h2>
            <Button type="submit" disabled={isUpdateOrganizationLoading}>
              {isUpdateOrganizationLoading && (
                <LucideIcon
                  name="loader-2"
                  className="mr-1 h-4 w-4 animate-spin"
                />
              )}
              Save
            </Button>
          </div>

          <div className="flex items-start border-b border-muted pb-6">
            <div className="w-full">
              <p className="text-foreground font-medium">
                {currentOrganization.name}
              </p>
              <p className="text-muted-foreground">
                {currentOrganization.profiles.length} team members
              </p>
            </div>

            <div className="max-w-[500px] w-full ml-auto">
              <input
                ref={inputAvatarImageRef}
                onChange={(event) => handleUploadAvatar(event)}
                type="file"
                className="hidden"
                accept="image/png, image/jpeg, image/gif"
              />

              <div className="flex items-center space-x-5">
                {/* <Avatar className={cn("w-[100px] h-[100px]")}>
                  <AvatarImage src={currentOrganization.thumbnail_url} />

                  <AvatarFallback className="bg-blue-200 text-background capitalize">
                    {currentOrganization.name[0]}
                  </AvatarFallback>
                </Avatar> */}
                <GenericAvatar
                  src={currentOrganization.thumbnail_url}
                  email={currentOrganization?.name || "fallback"}
                  className="w-[100px] h-[100px]"
                />

                <div>
                  {canEditOrganization && (
                    <Button
                      variant="outline"
                      type="button"
                      className="mb-5"
                      disabled={isUpdateOrganizationLoading}
                      onClick={() => inputAvatarImageRef.current.click()}
                    >
                      Upload new image
                    </Button>
                  )}

                  <p className="text-sm text-muted-foreground">
                    At least 800x800 px recommended. <br /> JPG or PNG and GIF
                    is allowed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start border-b border-muted py-6">
            <div className="w-[400px]">
              <p>Name</p>
            </div>

            <div className="w-full ml-auto">
              <div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Type team name..."
                          {...field}
                          disabled={!canEditOrganization}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export default OrganizationDetail;
