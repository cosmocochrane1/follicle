import { getTimeFromNow } from "@/lib/utils";
import { GenericAvatar } from "@/components/GenericAvatar";
import { useOthersMapped, useSelf } from "@/lib/liveblocks";
import { useDocument } from "@/lib/hooks/useDocument";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function DocumentLiveUsers({}) {
  const { document, isLoading } = useDocument();
  const others = useOthersMapped((other) => ({
    ...other.info,
  })).map(([_, other]) => other);
  const { info } = useSelf();

  const liveUsers = [info, ...others];
  return (
    <>
      {document && !isLoading ? (
        <div className="flex flex-1 items-center justify-end relative space-x-2 ">
          <div className="flex items-center relative z-0 aspect-square">
            {liveUsers?.slice(0, 3).map((other, index) => (
              <TooltipProvider key={other.email}>
                <Tooltip>
                  <TooltipTrigger>
                    <GenericAvatar
                      key={index}
                      src={other?.avatar_url}
                      email={other?.email || "fallback-" + Math.random()}
                      className={`relative z-${3 - index} ${
                        index > 0 ? "-ml-4" : ""
                      } border-4 border-background cursor-pointer h-10 w-10`}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{other.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
          {liveUsers?.length > 3 && (
            <p className="text-xs ml-1">
              + {liveUsers?.length - 3} other
              {liveUsers?.length - 3 <= 1 ? "" : "s"}
            </p>
          )}
        </div>
      ) : (
        <>
          <div />
          <Skeleton className="w-36 h-8 pl-8" />
        </>
      )}
    </>
  );
}
