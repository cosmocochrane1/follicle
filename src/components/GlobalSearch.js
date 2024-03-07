"use client";

import qs from "query-string";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/lib/hooks/utils/useDebounce";
import LucideIcon from "./LucideIcon";

export const GlobalSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const projectId = searchParams.get("project_id");
  const documentSearch = searchParams.get("d_s");
  const projectSearch = searchParams.get("p_s");

  const [value, setValue] = useState(documentSearch || projectSearch || "");
  const debouncedValue = useDebounce(value, 500);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    let query = {};
    if (projectId) {
      query["d_s"] = debouncedValue;
    } else {
      query["p_s"] = debouncedValue;
    }

    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  }, [debouncedValue, router]);

  return (
    <div className="relative w-full">
      <LucideIcon
        name="search"
        className="absolute h-4 w-4 top-3 left-4 text-muted-foreground"
      />
      <Input
        onChange={onChange}
        value={value}
        placeholder="Search..."
        className="pl-10 w-full"
      />
    </div>
  );
};
