import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import LucideIcon from "@/components/LucideIcon";
import { GenericAvatar } from "@/components/GenericAvatar";
import { useCurrentOrganization } from "@/lib/hooks/useCurrentOrganization";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { OrganizationCreateDialog } from "./OrganizationCreateDialog";
import { useOrganizations } from "@/lib/hooks/useOrganizations";
import { OrganizationDeleteDialog } from "./OrganizationDeleteDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function OrganizationList() {
  const [orgCreateDialogOpen, setOrgCreateDialogOpen] = useState(false);
  const [orgDeleteDialogOpen, setOrgDeleteDialogOpen] = useState();
  const { currentUser } = useCurrentUser();
  const { organizations, isLoading: isOrganizationsLoading } =
    useOrganizations();
  const { currentOrganization, setSelectedOrgId } = useCurrentOrganization();

  const isLoading = isOrganizationsLoading;

  const onClick = (typeId) => {
    setSelectedOrgId(typeId);
  };

  return (
    <>
      {/* <details className="" >
        <summary 
          onClick={() => {
            onClick()
          }}
          className={`
            ${!organization && 'bg-foreground/10 hover:bg-foreground/20'}
            flex items-center justify-between py-3 px-6 cursor-pointer stroke-primary hover:bg-foreground/10
          `}
        >
          <div className="flex flex-1 w-full items-start justify-start space-x-3 pl-0">
            <LucideIcon name='clock' className="h-5 w-5"/>
            <span className="text-sm ">Recent</span>
          </div>
        </summary>
      </details> */}
      <h4 className="px-6 py-4 pb-2 border-b border-card/10 text-sm font-medium">
        Teams
      </h4>
      {isLoading &&
        [...Array(4)].map((_, i) => {
          return (
            // <summary className="px-0 pb-2" key={i}>
            //   <Skeleton className="h-8 w-full rounded-none bg-foreground/10" />
            // </summary>
            <div
              className="flex w-full items-center justify-center px-6 py-3"
              key={i}
            >
              <Skeleton className="h-6 w-6 aspect-square rounded-full bg-foreground/10 pl-0 pr-6" />
              <div className="w-full pl-3 flex flex-col items-start justify-center space-y-1">
                {/* <Skeleton  className="h-6 w-full rounded-full bg-foreground/10" /> */}
                <Skeleton className="h-5 w-full rounded-lg bg-foreground/10" />
              </div>
            </div>
          );
        })}
      {!isLoading &&
        organizations &&
        organizations.length > 0 &&
        organizations.map((org) => {
          const isSelected =
            currentOrganization && currentOrganization.id == org.id;
          return (
            <details key={org.id}>
              <summary
                onClick={() => {
                  onClick(org.id);
                }}
                className={`
                  ${isSelected && "bg-foreground/10 hover:bg-foreground/20"}
                  flex items-center justify-between py-3 px-6 cursor-pointer stroke-primary hover:bg-foreground/10 group
                `}
              >
                <div className="flex flex-1 w-full items-center justify-start space-x-3 pl-0">
                  <GenericAvatar
                    src={org.thumbnail_url}
                    name={org.name}
                    className="h-6 w-6 aspect-square"
                  />
                  <span className="text-sm ">{org.name}</span>
                  {currentUser?.id !== org.id &&
                    currentUser?.id === org.owner_id && (
                      <div className="absolute right-3 opacity-0 transition-all group-hover:opacity-100 hover:opacity-100">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger
                              asChild
                              className="flex items-center-justify-center"
                            >
                              <Button
                                variant="ghost"
                                className="w-full px-3 opacity-60 hover:opacity-100 transition-all"
                                size="icon"
                                onClick={() => {
                                  // setOrgCreateDialogOpen(true);
                                  setOrgDeleteDialogOpen(org);
                                }}
                              >
                                <LucideIcon name="trash" className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Delete team</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                </div>
              </summary>
            </details>
          );
        })}
      <div className="p-3">
        <Button
          variant="outline"
          className="w-full flex items-center justify-start"
          onClick={() => {
            setOrgCreateDialogOpen(true);
          }}
        >
          <LucideIcon name="plus" className="h-5 w-5 mr-2" /> Create Team
        </Button>
      </div>
      <OrganizationCreateDialog
        onOpenChange={setOrgCreateDialogOpen}
        open={orgCreateDialogOpen}
        onCallback={() => {
          setOrgCreateDialogOpen(false);
        }}
      />
      <OrganizationDeleteDialog
        organization={orgDeleteDialogOpen}
        onOpenChange={() => {
          setOrgDeleteDialogOpen(null);
        }}
        open={!!orgDeleteDialogOpen}
        onCallback={() => {
          setOrgDeleteDialogOpen(null);
        }}
      />
    </>
  );
}
