import LucideIcon from "@/components/LucideIcon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import useUpdateCurrentUser from "@/lib/hooks/actions/useUpdateCurrentUser";
import { useScopes } from "@/lib/hooks/useScopes";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { uploadImage } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const profileDetailFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  full_name: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  scope: z
    .string({
      required_error: "Please select a scope.",
    })
    .min(2, {
      message: "Please select a scope.",
    }),
});

const ProfileDetailForm = () => {
  const { currentUser, isLoading: isLoadingCurrentUser } = useCurrentUser();
  const { updateUser, isLoading: isLoadingUpdateUser } = useUpdateCurrentUser();

  const { scopes, isLoading: isLoadingScopes } = useScopes();
  const inputAvatarImageRef = useRef(null);

  const defaultValues = isLoadingCurrentUser
    ? { username: "", full_name: "", avatar_url: "", scope: "" }
    : {
        username: currentUser?.username,
        full_name: currentUser?.full_name,
        avatar_url: currentUser?.avatar_url,
        scope: currentUser?.scope?.scope_access,
      };

  const form = useForm({
    resolver: zodResolver(profileDetailFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      await updateUser({
        username: data.username,
        full_name: data.full_name,
        scope_access: data.scope,
      });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated.",
      });
    } catch (error) {
      toast({
        title: "Failed to update profile",
        description: error.message,
      });
    }
  };

  const handleUploadAvatar = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const uploaded = await uploadImage(file, "profiles", `${currentUser.id}/`);

    try {
      await updateUser({ avatar_url: uploaded.publicUrl });
      toast({
        title: "Avatar updated",
        description: "Your profile avatar has been updated.",
      });
    } catch (error) {
      toast({
        title: "Failed to upload image",
        description: error.message,
      });
    }
  };

  useEffect(() => {
    if (currentUser && !isLoadingScopes) {
      form.setValue("username", currentUser.username);
      form.setValue("full_name", currentUser.full_name);
      form.setValue("avatar_url", currentUser.avatar_url);
      form.setValue("scope", currentUser.scope?.scope_access);
    }

    return () => {
      form.reset();
    };
  }, [currentUser, isLoadingScopes]);

  if (isLoadingCurrentUser || isLoadingScopes) {
    return (
      <>
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-5 w-[150px] rounded-full bg-foreground/10 mb-3" />
            <Skeleton className="h-5 w-[300px] rounded-full bg-foreground/10 mb-3" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-[100px] rounded-full bg-foreground/10 mb-3" />
            <Skeleton className="h-8 w-[100px] rounded-full bg-foreground/10 mb-3" />
          </div>
        </div>

        <hr className="border-muted my-5" />

        <div>
          <div className="mb-8 flex items-center space-x-5">
            <Skeleton className="h-[100px] w-[100px] rounded-full bg-foreground/10 mb-3" />
            <div>
              <Skeleton className="h-6 w-[100px] rounded-full bg-foreground/10 mb-3" />
              <Skeleton className="h-6 w-[150px] rounded-full bg-foreground/10 mb-3" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-5 gap-y-4">
            <Skeleton className="h-8 w-full rounded-full bg-foreground/10 mb-3" />
            <Skeleton className="h-8 w-full rounded-full bg-foreground/10 mb-3" />
            <Skeleton className="h-8 w-full rounded-full bg-foreground/10 mb-3" />
          </div>
        </div>
      </>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-lg">Personal info</p>
            <p className="text-muted-foreground">
              Update your photo and personal details here.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              className="w-[100px]"
              onClick={() => {
                form.reset({
                  full_name: currentUser.full_name,
                  username: currentUser.username,
                  scope: currentUser.scope?.scope_access,
                  avatar_url: currentUser.avatar_url,
                });
              }}
              disabled={isLoadingUpdateUser}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-[100px]"
              disabled={isLoadingUpdateUser}
            >
              Save
            </Button>
          </div>
        </div>

        <hr className="border-muted my-5" />

        <div>
          <div className="mb-8">
            <FormField
              control={form.control}
              name="avatar_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <FormControl>
                    <input
                      ref={inputAvatarImageRef}
                      onChange={handleUploadAvatar}
                      type="file"
                      className="hidden"
                      accept="image/png, image/jpeg, image/gif"
                    />
                  </FormControl>

                  <div className="flex items-center space-x-5">
                    <Avatar
                      className={cn(
                        "w-[100px] h-[100px] flex-none cursor-pointer",
                        {
                          "border-2 border-dashed border-foreground/20":
                            !field.value,
                        },
                      )}
                      onClick={() => inputAvatarImageRef.current.click()}
                    >
                      <AvatarImage src={field.value} />
                      <AvatarFallback>
                        <LucideIcon name="user-plus" />
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <Button
                        variant="outline"
                        type="button"
                        className="mb-5"
                        onClick={() => inputAvatarImageRef.current.click()}
                        disabled={isLoadingUpdateUser}
                      >
                        Upload new image
                      </Button>

                      <FormDescription>
                        At least 800x800 px recommended. <br /> JPG or PNG and
                        GIF is allowed.
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="scope"
              render={({ field, ...props }) => (
                <FormItem>
                  <FormLabel>Scope</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) =>
                        field.onChange({ target: { name: field.name, value } })
                      }
                    >
                      <SelectTrigger className="truncate capitalize">
                        <SelectValue>
                          {scopes?.find((scope) => scope.access === field.value)
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ProfileDetailForm;
