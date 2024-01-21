"use client";

import { Copy, HelpCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Hint } from "./hint";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { ReactNode } from "react";
import { boardFormSchema } from "@/actions/action-schema";
import router from "next/router";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { revalidatePath, revalidateTag } from "next/cache";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import ImagePicker from "./image-picker";

interface CreateBoardForm {}

const CreateBoardForm = ({}: CreateBoardForm) => {
  const params = useParams();
  const router = useRouter();
  const form = useForm<z.infer<typeof boardFormSchema>>({
    resolver: zodResolver(boardFormSchema),
    defaultValues: {
      title: "",
      imageId: "mock-image-url",
    },
  });

  const {
    mutate: createBoard,
    status,
    data,
  } = useMutation({
    mutationKey: ["createBoard"],
    mutationFn: (payload: z.infer<typeof boardFormSchema>) =>
      axios.post("/api/board/create", payload),
    onSuccess(data, variables, context) {
      // toast
      console.log("board created");
      router.refresh();
    },

    // onError: (err) => {
    //   if (err instanceof AxiosError) {
    //     if (err.response?.status === 409) {
    //       return console.log({
    //         title: "Subreddit already exists.",
    //         description: "Please choose a different name.",
    //         variant: "destructive",
    //       });
    //     }

    //     if (err.response?.status === 422) {
    //       return console.log({
    //         title: "Invalid subreddit name.",
    //         description: "Please choose a name between 3 and 21 letters.",
    //         variant: "destructive",
    //       });
    //     }

    //     if (err.response?.status === 401) {
    //       return console.log("unaautrized");
    //     }
    //   }

    //   console.log({
    //     title: "There was an error.",
    //     description: "Could not create subreddit.",
    //     variant: "destructive",
    //   });
    // },
  });

  async function onSubmit(values: z.infer<typeof boardFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    createBoard(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Board Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Img id</FormLabel>
              <FormControl>
                <Input placeholder="img id" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ImagePicker id={"mock-imge-if"}  />
        <div className="">
          <Button
            type="submit"
            disabled={status === "pending" || status === "success"}
            className={cn(status === "success" ? "bg-green-600" : "", "w-full")}
          >
            {status === "pending" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating
              </>
            ) : status === "success" ? (
              "Created"
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

const CreateBoardFormModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col shadow gap-y-1 items-center justify-center hover:opacity-75 transition"
        >
          <p className="text-sm">Create new board</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Board</DialogTitle>
          <DialogDescription>
            Create a board for your organization
          </DialogDescription>
        </DialogHeader>

        {/* form */}
        <CreateBoardForm />
        {/* <DialogFooter className="sm:justify-end gap-2 flex-col ">
          <DialogClose className="" asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
};

export default CreateBoardFormModal;
