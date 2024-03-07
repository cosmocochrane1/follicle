import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { Skeleton } from "../ui/skeleton";
import { useTheme } from "next-themes";
import { OrganizationDialog } from "../Organizations/OrganizationDialog";
import { useState } from "react";
import { ProfileDialog } from "./ProfileDialog";
import LucideIcon from "../LucideIcon";
import { useCurrentOrganization } from "@/lib/hooks/useCurrentOrganization";
import { GenericAvatar } from "@/components/GenericAvatar";

export function ProfileMenu() {
  const [profileDialog, setProfileDialog] = useState(false);
  const [teamDialog, setTeamDialog] = useState(false);
  const { setTheme } = useTheme();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const {
    currentOrganization,
    isLoading: isCurrentOrganizationLoading,
    setSelectedOrgId,
  } = useCurrentOrganization();
  const { currentUser, isLoading: isCurrentUserLoading } = useCurrentUser();
  const organizations = currentUser?.organizations || [];
  const organization =
    currentOrganization &&
    organizations.find((o) => o.id === currentOrganization.id);
  const isLoading = isCurrentUserLoading || isCurrentOrganizationLoading;

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    router.refresh();

    if (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  asChild
                  className="flex items-center-justify-center"
                >
                  <Button
                    variant="ghost"
                    className="aspect-square rounded-full p-0 m-0 h-8 w-8 "
                  >
                    {isLoading ? (
                      <Skeleton className="aspect-square w-full h-full rounded-full" />
                    ) : (
                      <GenericAvatar
                        src={currentUser?.avatar_url}
                        email={currentUser?.email || "fallback"}
                        className="cursor-pointer hover:opacity-80"
                      />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left" sideOffset={22}>
                  <p className="text-xs">Menu</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent open={true} className="w-56">
          <DropdownMenuLabel className="pb-0 text-md truncate font-medium">
            {currentUser?.username ||
              currentUser?.full_name ||
              currentUser?.email}
          </DropdownMenuLabel>
          <DropdownMenuLabel className="pt-0 text-xs font-normal text-foreground/50 truncate">
            {currentUser?.email}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push("/settings/account")}
          >
            <LucideIcon name="user" className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          {/* <DropdownMenuSeparator /> */}
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push("/settings/team")}
            >
              <LucideIcon name="user-plus" className="mr-2 h-4 w-4" />
              <span>Manage Team</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <LucideIcon
                  name="sun"
                  className=" rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 mr-2 h-4 w-4"
                />
                <LucideIcon
                  name="moon"
                  className="absolute  rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 mr-2 h-4 w-4"
                />
                <span>Theme</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onClick={() => setTheme("light")}
                    className="cursor-pointer"
                  >
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setTheme("dark")}
                    className="cursor-pointer"
                  >
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setTheme("system")}
                    className="cursor-pointer"
                  >
                    System
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
            <LucideIcon name="log-out" className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <OrganizationDialog open={teamDialog} onOpenChange={setTeamDialog} />
      <ProfileDialog open={profileDialog} onOpenChange={setProfileDialog} />
    </>
  );
}
