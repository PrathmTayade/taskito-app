"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { MoreHorizontal, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface BoardOptionsProps {
  id: string;
}

export const BoardOptions = ({ id }: BoardOptionsProps) => {
  const router = useRouter();
  const onDelete = () => {
    deleteBoard({ id });
  };

  const {
    mutate: deleteBoard,
    status,
    data,
  } = useMutation({
    mutationKey: ["deleteBoard"],
    mutationFn: (payload: { id: string }) =>
      axios.post("/api/board/delete", payload),
    // axios.delete(`/api/board/create`, { data: payload }),
    onSuccess(data, variables, context) {
      toast.success("Board deleted.");
      router.push("/");
    },

    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 404) {
          return toast.error("Board does not exists.");
        }

        if (err.response?.status === 500) {
          return toast.error("Could not delete the board.");
        }

        if (err.response?.status === 401) {
          return toast.error("Unauthorized.");
        }
      } else {
        toast.error("Error deleting the board.");
      }
    },
  });
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant="transparent">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="pt-3 pb-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Board actions
        </div>
        <PopoverClose asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Button
          variant="default"
          onClick={onDelete}
          disabled={status === "pending"}
          className="bg-red-500 hover:bg-red-600 text-white py-2 rounded  w-full  h-auto p-2 px-5 justify-start font-bold text-sm"
        >
          <Trash2 className="h-4 w-4 mr-2" /> Delete this board
        </Button>
      </PopoverContent>
    </Popover>
  );
};
