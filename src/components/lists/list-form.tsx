"use client";

import { toast } from "sonner";
import { Loader2, Plus, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useRef, ElementRef } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { ListWrapper } from "./list-wrapper";
import { CreateList } from "@/actions/action-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import axios, { AxiosError } from "axios";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { revalidatePathFromServer } from "@/lib/action-utils";

const ListForm = ({ disableEditing }: { disableEditing: () => void }) => {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();

  const formRef = useRef<ElementRef<"form">>(null);

  const form = useForm<z.infer<typeof CreateList>>({
    resolver: zodResolver(CreateList),
    defaultValues: {
      title: "",
      boardId: params.boardId as string,
    },
  });

  const {
    mutate: createList,
    status,
    data,
    reset,
  } = useMutation({
    mutationKey: ["createList"],
    mutationFn: (payload: z.infer<typeof CreateList>) =>
      axios.post("/api/list", payload),
    onSuccess(data, variables, context) {
      toast.success(`List "${data.data.title}" created`);
      queryClient.invalidateQueries({ queryKey: ["lists", params.boardId] });
      // revalidatePathFromServer(`/board/${params.boardId}`);
      reset();
      disableEditing();
      //  closeForm();
      // router.refresh();
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

      console.log({
        title: "There was an error.",
        description: "Could not create subreddit.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof CreateList>) => {
    console.log(values);
    createList(values);
  };

  useOnClickOutside(formRef, disableEditing);

  setTimeout(() => {
    form.setFocus("title");
  }, 3);
  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full p-3 rounded-md bg-white space-y-4 shadow-md"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="List Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-x-1">
          <Button
            type="submit"
            variant={"primary"}
            disabled={status === "pending" || status === "success"}
            className={cn(status === "success" ? "bg-green-600" : "", "w-full")}
          >
            {status === "pending" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding
              </>
            ) : status === "success" ? (
              "Added"
            ) : (
              "Add list"
            )}
          </Button>
          <Button
            type="button"
            onClick={disableEditing}
            size="sm"
            variant="ghost"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export const CreateListForm = () => {
  const [isEditing, setIsEditing] = useState(false);

  const enableEditing = () => {
    setIsEditing(true);
  };
  const disableEditing = () => {
    setIsEditing(false);
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };
  useEventListener("keydown", onKeyDown);
  return (
    <ListWrapper>
      {isEditing ? (
        <ListForm disableEditing={disableEditing} />
      ) : (
        <button
          type="button"
          onClick={enableEditing}
          className="w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 flex items-center font-medium text-sm text-black"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add a list
        </button>
      )}
    </ListWrapper>
  );
};
