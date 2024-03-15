"use client";

import { toast } from "sonner";
import { Copy, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCardModal } from "@/hooks/use-card-modal";
import { CardWithList } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { revalidatePathFromServer } from "@/lib/action-utils";
import axios, { AxiosError } from "axios";

interface ActionsProps {
  data: CardWithList;
}

export const Actions = ({ data }: ActionsProps) => {
  const params = useParams();
  const cardModal = useCardModal();
  const queryClient = useQueryClient();
  const boardId = params.boardId;

  // const {
  //   execute: executeCopyCard,
  //   isLoading: isLoadingCopy,
  // } = useAction(copyCard, {
  //   onSuccess: (data) => {
  //     toast.success(`Card "${data.title}" copied`);
  //     cardModal.onClose();
  //   },
  //   onError: (error) => {
  //     toast.error(error);
  //   },
  // });

  // const {
  //   execute: executeDeleteCard,
  //   isLoading: isLoadingDelete,
  // } = useAction(deleteCard, {
  //   onSuccess: (data) => {
  //     toast.success(`Card "${data.title}" deleted`);
  //     cardModal.onClose();
  //   },
  //   onError: (error) => {
  //     toast.error(error);
  //   },
  // });

  const onCopy = () => {
    console.log({
      id: data.id,
      boardId,
    });
  };

  const onDelete = () => {
    deleteCard(data.id);
    queryClient.invalidateQueries({ queryKey: ["card"] });
  };

  const {
    mutate: deleteCard,
    status,
    data: listData,
  } = useMutation({
    mutationKey: ["deleteCard"],
    mutationFn: (id: string) => axios.delete(`/api/cards?cardId=${id}`),
    onSuccess(data, variables, context) {
      toast.success("Card deleted.");
      cardModal.onClose();
      // revalidatePathFromServer(`/board/${boardId}`);
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
    <div className="space-y-2 mt-2">
      <p className="text-xs font-semibold">Actions</p>
      <Button
        onClick={onCopy}
        // disabled={isLoadingCopy}
        variant="gray"
        className="w-full justify-start"
        size="inline"
      >
        <Copy className="h-4 w-4 mr-2" />
        Copy
      </Button>
      <Button
        onClick={onDelete}
        disabled={status == "pending"}
        variant="destructive"
        className="w-full justify-start"
        size="inline"
      >
        <Trash className="h-4 w-4 mr-2" />
        Delete
      </Button>
    </div>
  );
};

Actions.Skeleton = function ActionsSkeleton() {
  return (
    <div className="space-y-2 mt-2">
      <Skeleton className="w-20 h-4 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
    </div>
  );
};
