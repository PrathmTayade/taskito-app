"use client";

import { Loader2 } from "lucide-react";
import { boardFormSchema } from "@/actions/action-schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import ImagePicker from "./image-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

interface CreateBoardForm {
  closeForm: () => void;
}

const CreateBoardForm = ({ closeForm }: CreateBoardForm) => {
  const params = useParams();
  const router = useRouter();
  const form = useForm<z.infer<typeof boardFormSchema>>({
    resolver: zodResolver(boardFormSchema),
    defaultValues: {
      title: "",
      image: "",
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
      toast.success("Board created.");
      closeForm();
      // router.refresh();
      router.push(`/board/${data.data}`);
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

  async function onSubmit(values: z.infer<typeof boardFormSchema>) {
    // Do something with the form values.
    const { title, image } = values;
    createBoard({ title, image });
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
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <ImagePicker field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="">
          <Button
            type="submit"
            disabled={status === "pending" || status === "success"}
            className={cn(status === "success" ? "bg-green-600" : "", "w-full")}
            variant={"primary"}
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

interface CreateBoardFormModalProps {
  children: React.ReactNode;
}

const CreateBoardFormModal = ({ children }: CreateBoardFormModalProps) => {
  const [open, setOpen] = useState(false);

  const closeForm = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Board</DialogTitle>
          <DialogDescription>
            Create a board for your organization
          </DialogDescription>
        </DialogHeader>

        {/* form */}
        <CreateBoardForm closeForm={closeForm} />
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
