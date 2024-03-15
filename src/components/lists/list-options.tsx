"use client";

import { toast } from "sonner";
import { TaskApp_List } from "@prisma/client";
import { ElementRef, useRef } from "react";
import { Copy, MoreHorizontal, Trash2, X } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import router from "next/router";
import { revalidatePathFromServer } from "@/lib/action-utils";
import { useParams } from "next/navigation";
import { CreateCardForm } from "../cards/card-form";

interface ListOptionsProps {
  data: TaskApp_List;
  onAddCard: () => void;
}

export const ListOptions = ({ data: list, onAddCard }: ListOptionsProps) => {
  const closeRef = useRef<ElementRef<"button">>(null);
  const params = useParams();
  const queryClient = useQueryClient();

  const onDelete = () => deleteList(list.id);

  const onCopy = () => {
    toast.info("feature WIP check again soon");
  };
  const {
    mutate: deleteList,
    status,
    data: listData,
  } = useMutation({
    mutationKey: ["deleteList"],
    mutationFn: (id: string) =>
      axios.delete(`/api/list?listId=${id}&boardId=${list.boardId}`),
    onSuccess(data, variables, context) {
      toast.success("List deleted.");
      // revalidatePathFromServer(`/board/${params.boardId}`);
      queryClient.invalidateQueries({
        queryKey: ["lists", params.boardId],
      });
    },

    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 404) {
          return toast.error("List does not exists.");
        }

        if (err.response?.status === 500) {
          return toast.error("Could not delete the List.");
        }

        if (err.response?.status === 401) {
          return toast.error("Unauthorized.");
        }
      } else {
        toast.error("Error deleting the List.");
      }
    },
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          List actions
          <PopoverClose ref={closeRef} asChild>
            <Button
              className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
              variant="ghost"
            >
              <X className="h-4 w-4" />
            </Button>
          </PopoverClose>
        </div>
        <div className="flex flex-col gap-2 px-2">
          {/* Add card add if feel like it */}
          {/* <CreateCardForm listId={list.id} /> */}
          {/* Delete List */}
          <Button
            variant="ghost"
            onClick={onCopy}
            disabled={status === "pending"}
            className=" px-2 py-1.5 justify-start"
            size={"sm"}
          >
            <Copy className="h-4 w-4 mr-2" /> Duplicate List
          </Button>
          <Button
            variant="destructive"
            onClick={onDelete}
            disabled={status === "pending"}
            className="px-2 py-1.5  justify-start "
            size={"sm"}
          >
            <Trash2 className="h-4 w-4 mr-2" /> Delete List
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
