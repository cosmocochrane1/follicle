import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrentOrganization } from "@/lib/hooks/useCurrentOrganization";
import { Skeleton } from "../ui/skeleton";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";

export default function OrganizationSelector() {
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

  return (
    <>
      {(isLoading || !organization) && <Skeleton className="w-32 h-10" />}
      {!isLoading && organization && (
        <Select
          defaultValue={organization.id}
          value={organization.id}
          onValueChange={(value) => setSelectedOrgId(value)}
        >
          <SelectTrigger className="w-full max-w-full overflow-hidden">
            <SelectValue className="truncate">{organization.name}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {organizations.map((o) => (
              <SelectItem key={o.id} value={o.id} className="truncate">
                {o.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </>
  );
}
