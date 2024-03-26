"use client";

import { UpdateCard } from "@/actions/action-schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { CardWithList } from "@/lib/types";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { AlignLeft, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { ElementRef, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEventListener } from "usehooks-ts";
import { z } from "zod";
import { Textarea } from "../ui/textarea";

interface DescriptionProps {
  data: CardWithList;
}

export const Description = ({ data }: DescriptionProps) => {
  const params = useParams();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);

  const formRef = useRef<ElementRef<"form">>(null);
  const textareaRef = useRef<ElementRef<"textarea">>(null);

  const form = useForm<z.infer<typeof UpdateCard>>({
    resolver: zodResolver(UpdateCard),
    defaultValues: {
      id: data.id,
      description: data.description ? data.description : "",
    },
  });

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
    form.reset();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  useEventListener("keydown", onKeyDown);

  const {
    mutate: updateCard,
    status,
    data: cardData,
    reset,
  } = useMutation({
    mutationKey: ["createCard"],
    mutationFn: (payload: z.infer<typeof UpdateCard>) =>
      axios.put(`/api/cards/${data.id}`, payload),
    onSuccess(data, variables, context) {
      toast.success("Description saved");
      queryClient.invalidateQueries({
        queryKey: ["card"],
      });
      queryClient.invalidateQueries({
        queryKey: ["card-logs"],
      });
      // revalidatePathFromServer(`/board/${params.boardId}`);
      form.reset();
      disableEditing();
      reset();
    },

    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast.error("Board already exists.");
        }

        if (err.response?.status === 422) {
          return toast.error("Invalid Board name.");
        }

        if (err.response?.status === 401) {
          return toast.error("Unauthorized.");
        }
      }
    },
  });

  const onSubmit = (values: z.infer<typeof UpdateCard>) => {
    updateCard(values);
  };

  return (
    <div className="flex items-start gap-x-3 w-full">
      <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700" />
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">Description</p>
        {isEditing ? (
          <Form {...form}>
            <form
              ref={formRef}
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-2"
            >
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        className="w-full mt-2"
                        placeholder="Add a more detailed description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-x-2">
                <Button
                  type="submit"
                  variant={"primary"}
                  size={"sm"}
                  disabled={status === "pending" || status === "success"}
                  className={cn(
                    status === "success" ? "bg-green-600" : "",
                    "px-8"
                  )}
                >
                  {status === "pending" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving
                    </>
                  ) : status === "success" ? (
                    "Saved"
                  ) : (
                    "Save"
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={disableEditing}
                  size="sm"
                  variant="ghost"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div
            onClick={enableEditing}
            role="button"
            className="min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md"
          >
            {data.description || "Add a more detailed description..."}
          </div>
        )}
      </div>
    </div>
  );
};

Description.Skeleton = function DescriptionSkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="h-6 w-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
        <Skeleton className="w-full h-[78px] bg-neutral-200" />
      </div>
    </div>
  );
};
