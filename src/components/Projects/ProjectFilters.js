// pages/index.js
import { Button } from "@/components/ui/button";
import { useState } from "react";
import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProjectFilters({ project }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter");

  const onClick = (value) => {
    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query: {
          filter: value,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  };

  return (
    <div className="w-auto">
      <div className="flex items-center justify-start space-x-3 w-auto">
        <Button
          className={`w-auto flex items-center justify-center ${
            !filter ? "bg-foreground/10 bg-opacity-10" : "bg-opacity-0"
          }`}
          variant="ghost"
          onClick={() => {
            onClick("");
          }}
        >
          Recently viewed
        </Button>
        <Button
          className={`w-auto flex items-center justify-center ${
            filter === "shared"
              ? "bg-foreground/20 bg-opacity-10"
              : "bg-opacity-0"
          }`}
          variant="ghost"
          onClick={() => {
            onClick("shared");
          }}
        >
          Shared projects
        </Button>
        <Button
          className={`w-auto flex items-center justify-center ${
            filter === "all" ? "bg-foreground/20 bg-opacity-10" : "bg-opacity-0"
          }`}
          variant="ghost"
          onClick={() => {
            onClick("all");
          }}
        >
          All projects
        </Button>
      </div>
    </div>
  );
}
