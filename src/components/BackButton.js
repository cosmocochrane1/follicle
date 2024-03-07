import * as React from "react";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import Link from "next/link";
import LucideIcon from "./LucideIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function BackButton({ href = "/projects" }) {
  const router = useRouter();
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild className="flex items-center-justify-center">
          <Link href={href} className="">
            <Button type="button" variant="ghost" size="icon">
              <LucideIcon name="arrow-left" size={20} />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Back</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
