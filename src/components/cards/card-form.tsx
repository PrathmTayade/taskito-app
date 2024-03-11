"use client";

import { toast } from "sonner";
import { Loader2, Plus, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useRef, ElementRef } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { CreateCard, CreateList } from "@/actions/action-schema";
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
import { Textarea } from "../ui/textarea";

const CardForm = ({
  disableEditing,
  listId,
}: {
  disableEditing: () => void;
  listId: string;
}) => {
  const queryClient = useQueryClient();
  const params = useParams();

  const formRef = useRef<ElementRef<"form">>(null);

  const form = useForm<z.infer<typeof CreateCard>>({
    resolver: zodResolver(CreateCard),
    defaultValues: {
      title: "",
      listId: listId,
      boardId: params.boardId as string,
    },
  });

  const {
    mutate: createCard,
    status,
    data,
    reset,
  } = useMutation({
    mutationKey: ["createCard"],
    mutationFn: (payload: z.infer<typeof CreateCard>) =>
      axios.post("/api/cards", payload),
    onSuccess(data, variables, context) {
      toast.success(`Card "${data.data.title}" created`);
      // queryClient.invalidateQueries({ queryKey: ["cards"] });
      revalidatePathFromServer(`/board/${params.boardId}`);
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

  const onSubmit = (values: z.infer<typeof CreateCard>) => {
    createCard(values);
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
                <Textarea placeholder="Card Title" {...field} />
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
              "Add card"
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

export const CreateCardForm = ({ listId }: { listId: string }) => {
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
    <div className="pt-2">
      {isEditing ? (
        <CardForm disableEditing={disableEditing} listId={listId} />
      ) : (
        <Button
          onClick={enableEditing}
          className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm"
          size="sm"
          variant="ghost"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add a card
        </Button>
      )}
    </div>
  );
};
