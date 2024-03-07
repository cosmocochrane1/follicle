"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useProfiles } from "@/lib/hooks/useProfiles"
import LucideIcon from "../../LucideIcon"

export function ProjectInviteComboBox({ placeholder, setValue, value }) {
  const { profiles, isLoading } = useProfiles();

  return (
    <Popover disabled={isLoading}>
      <PopoverTrigger disabled={isLoading}  asChild>
        <Button
          disabled={isLoading} 
          variant="outline"
          role="combobox"
          className="w-full justify-between"
        >
          {value
            ? profiles.find((profile) => profile.email === value)?.email
            : (placeholder || "Select User...")}
          <LucideIcon name="chevrons-up-down" className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            {profiles?.map((profile) => (
              <CommandItem
                key={profile.email}
                onSelect={(currentValue) => {
                  setValue("email", currentValue)
                }}
              >
                <LucideIcon
                  name="check"
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === profile.email ? "opacity-100" : "opacity-0"
                  )}
                />
                {profile.email}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
