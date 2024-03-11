import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useScopes } from "@/lib/hooks/useScopes";

// Define a Zod schema for the form validation
const organizationInvitationAccountDetailFormSchema = z.object({
  specialties: z.any().optional(),
  Location: z.any().optional(),
});

export function DoctorSearch({ onContinue }) {
  const form = useForm({
    resolver: zodResolver(organizationInvitationAccountDetailFormSchema),
    defaultValues: {},
    reValidateMode: "onChange",
    criteriaMode: "all",
  });

  // Submit handler for the form
  const onSubmit = async (values) => {
    onContinue && onContinue();
  };

  return (
    <>
      <Form {...form} className="w-full h-full p-1">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col w-full space-y-3 bg-card p-12 py-8 shadow-sm rounded-3xl "
        >
          <div className="pt-4 flex justify-between align-center gap-4">
            <FormField
              className="w-full flex-1"
              control={form.control}
              name="specialties"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Specialties</FormLabel>
                  <div className="w-full">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Condition, procedure,doctors"
                        className="w-full"
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
              name="Location"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Location</FormLabel>
                  <div className="w-full">
                    <FormControl>
                      <Input
                        type="date"
                        placeholder="Condition, procedure,doctors"
                        className="w-full"
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
