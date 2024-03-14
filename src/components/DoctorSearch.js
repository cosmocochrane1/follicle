import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import qs from "query-string";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LucideIcon from "@/components/LucideIcon";
import { useRouter } from "next/navigation";

// Define a Zod schema for the form validation
const doctorSearchSchema = z.object({
  specialties: z.any().optional(),
  location: z.any().optional(),
});

export function DoctorSearch({ onContinue }) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(doctorSearchSchema),
    defaultValues: {
      specialties: "",
      location: "",
    },
    reValidateMode: "onChange",
    criteriaMode: "all",
  });

  // Submit handler for the form
  const onSubmit = async (values) => {
    // we want to update the query parameters
    let queryParts = [];
    if (values.specialties) {
      queryParts.push(`specialties=${values.specialties}`);
    }
    if (values.location) {
      queryParts.push(`location=${values.location}`);
    }
    const query = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";

    router.push(`/search${query}`);
    onContinue && onContinue();
  };

  return (
    <>
      <Form {...form} className="w-full h-full p-1">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col w-full space-y-3 bg-background p-12 py-8 shadow-sm rounded-3xl "
        >
          <div className=" flex justify-between align-center gap-14">
            <FormField
              className="w-full flex-1"
              control={form.control}
              name="specialties"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-md tracking-wider">
                    Specialties
                  </FormLabel>
                  <div className="w-full relative">
                    <LucideIcon
                      name="search"
                      className="h-5 w-5 text-red-500 absolute left-0 top-1/2 transform -translate-y-1/2"
                    />
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Condition, procedure,doctors"
                        className="w-full text-md tracking-wider pl-8 bg-background rounded-none border-t-0 border-r-0 border-l-0 border-b-2 border-card"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="mt-3" />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              className="w-full flex-1"
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-md tracking-wider">
                    Location
                  </FormLabel>
                  <div className="w-full relative">
                    <LucideIcon
                      name="map-pin"
                      className="h-5 w-5 text-red-500 absolute left-0 top-1/2 transform -translate-y-1/2"
                    />
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="City, state, or zip code"
                        className="w-full text-md tracking-wider pl-8 bg-background rounded-none border-t-0 border-r-0 border-l-0 border-b-2 border-card"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="mt-3" />
                  </div>
                </FormItem>
              )}
            />

            <div className="aspect-square w-[74px] h-[74px]">
              <Button
                type="submit"
                className="w-[74px] h-[74px] rounded-3xl animate-pulse"
                size="icon"
                disabled={form.formState.errors.password}
              >
                {<LucideIcon name="search" className="h-8 w-8" />}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
