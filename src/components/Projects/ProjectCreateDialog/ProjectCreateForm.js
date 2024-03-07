import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";

import { Textarea } from "@/components/ui/textarea";
import useCreateProject from "@/lib/hooks/actions/useCreateProject";
import LucideIcon from "../../LucideIcon";

// Define a Zod schema for the form validation
const inviteSchema = z.object({
  name: z.string({
    message: "Please enter a valid email address.",
  }),
});

export function ProjectCreateForm({ onCallback, onOpenChange }) {
  const { toast } = useToast();
  const { createProject, isLoading, error } = useCreateProject();
  const form = useForm({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Submit handler for the form
  const onSubmit = async ({ name, description }) => {
    const response = await createProject({
      name: name,
      description: description,
    });

    onCallback && onCallback();
  };

  // we useEffect for error handling
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  }, [error]);

  return (
    <Form {...form} className="w-full">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full items-center space-y-3 py-2"
      >
        <FormField
          className="w-full"
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl className="w-full">
                <div className="flex w-full items-cente">
                  <Input
                    type="name"
                    placeholder="Project name..."
                    className="w-full"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          className="w-full"
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl className="w-full">
                <div className="flex w-full items-center">
                  <Textarea
                    type="description"
                    placeholder="Project description (optional)"
                    className="w-full"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <footer className="flex justify-end w-full space-x-3">
          <Button
            disabled={isLoading}
            variant="ghost"
            type="button"
            className="w-auto"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button disabled={isLoading} type="submit" className="w-auto px-8">
            {" "}
            {isLoading ? (
              <LucideIcon
                name="loader-2"
                className="mr-1 h-5 w-5 animate-spin"
              />
            ) : (
              <LucideIcon name="plus" className="mr-1 h-5 w-5" />
            )}{" "}
            Create
          </Button>
        </footer>
      </form>
    </Form>
  );
}
