import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams } from 'next/navigation';

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

export function DoctorSearch({ refreshDoctorSearch }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const specialties = searchParams.get('specialties');
  const location = searchParams.get('location');

  const form = useForm({
    resolver: zodResolver(doctorSearchSchema),
    defaultValues: {
      specialties: specialties,
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

    refreshDoctorSearch && refreshDoctorSearch()
  };

  return (
    <>
      <Form {...form} className="w-full h-full p-1">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col w-full p-12 py-8 space-y-3 shadow-sm bg-background rounded-3xl "
        >
          <div className="flex flex-col justify-between flex-1 w-full md:flex-row lg:flex-row align-center gap-14">
            <FormField
              className="flex-1 w-full"
              control={form.control}
              name="specialties"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="tracking-wider text-md">
                    Specialties
                  </FormLabel>
                  <div className="relative w-full">
                    <LucideIcon
                      name="search"
                      className="absolute left-0 w-5 h-5 text-red-500 transform -translate-y-1/2 top-1/2"
                    />
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Condition, procedure,doctors"
                        className="w-full pl-8 tracking-wider border-t-0 border-b-2 border-l-0 border-r-0 rounded-none text-md bg-background border-card"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="mt-3" />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              className="flex-1 w-full"
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="tracking-wider text-md">
                    Location
                  </FormLabel>
                  <div className="relative w-full">
                    <LucideIcon
                      name="map-pin"
                      className="absolute left-0 w-5 h-5 text-red-500 transform -translate-y-1/2 top-1/2"
                    />
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="City, state, or zip code"
                        className="w-full pl-8 tracking-wider border-t-0 border-b-2 border-l-0 border-r-0 rounded-none text-md bg-background border-card"
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
                {<LucideIcon name="search" className="w-8 h-8" />}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
