"use client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

import { useAction } from "@/hooks/use-action";

import { ListWithCards } from "@/lib/types";
import { ListItem } from "./list-item";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect, useParams } from "next/navigation";
import axios from "axios";
import { CreateListForm } from "./list-form";
import { fetcher } from "@/lib/fetcher";

interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export const ListContainer = ({ data, boardId }: ListContainerProps) => {
  // const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
  //   onSuccess: () => {
  //     toast.success("List reordered");
  //   },
  //   onError: (error) => {
  //     toast.error(error);
  //   },
  // });

  // const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
  //   onSuccess: () => {
  //     toast.success("Card reordered");
  //   },
  //   onError: (error) => {
  //     toast.error(error);
  //   },
  // });
  const params = useParams();
  const queryClient = useQueryClient();
  const fetchLists = async () => {
    const { data } = await axios.get("/api/list", {
      params: { boardId: boardId },
    });
    return data.lists;
  };

  const {
    data: listData,
    isPending,
    error,
    refetch: refectLists,
  } = useQuery<ListWithCards[]>({
    queryKey: ["lists", boardId],
    queryFn: fetchLists,

    // initialData: [],
    // enabled: ,
    // select: (data) => data.sort((a, b) => a.order - b.order),
  });

  /* //todo  
  1 is pending states
  2 error then swithcback to orginal states
  3 not use setdata directly as we dont know if its success
  
  */
 
  const {
    mutate: updateListOrder,
    isPending: isUpdatingListOrder,
    isError: isListOrderError,
    error: listOrderError,
  } = useMutation({
    mutationFn: (newListItems: ListWithCards[]) =>
      axios.patch("/api/list", { items: newListItems, boardId: boardId }),
    onSettled: () => {
      // queryClient.invalidateQueries({ queryKey: ["lists", params.boardId] });
      refectLists();
      toast.success("List reordered");
    },
    // console.log("list updated"),

    mutationKey: ["updateLists"],
  });
  const [orderedData, setOrderedData] = useState<ListWithCards[]>(
    listData || []
  );

  useEffect(() => {
    if (listData) setOrderedData(listData);
  }, [listData]);

  if (error) {
    console.log(error);

    return <div>error loading the data {error.message}</div>;
  }
  if (isPending) {
    <div> loading</div>;
  }

  const onDragEnd = (result: any) => {
    console.log(result);

    const { destination, source, type } = result;

    if (!destination) {
      return;
    }

    // if dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // User moves a list
    if (type === "lists") {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index })
      );
      console.log(items);

      setOrderedData(items);
      // executeUpdateListOrder({ items, boardId });
      updateListOrder(items);
    }

    // User moves a card
    if (type === "cards") {
      let newOrderedData = [...orderedData];

      // Source and destination list
      const sourceList = newOrderedData.find(
        (list) => list.id === source.droppableId
      );
      const destList = newOrderedData.find(
        (list) => list.id === destination.droppableId
      );

      if (!sourceList || !destList) {
        return;
      }

      // Check if cards exists on the sourceList
      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      // Check if cards exists on the destList
      if (!destList.cards) {
        destList.cards = [];
      }

      // Moving the card in the same list
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );

        reorderedCards.forEach((card, idx) => {
          card.order = idx;
        });

        sourceList.cards = reorderedCards;

        setOrderedData(newOrderedData);
        toast.info("feature WIP check again soon");

        // executeUpdateCardOrder({
        //   boardId: boardId,
        //   items: reorderedCards,
        // });

        // refectLists();
        // queryClient.invalidateQueries({
        //   queryKey: ["lists", params.boardId],
        // });

        // User moves the card to another list
      } else {
        // Remove card from the source list
        const [movedCard] = sourceList.cards.splice(source.index, 1);

        // Assign the new listId to the moved card
        movedCard.listId = destination.droppableId;

        // Add card to the destination list
        destList.cards.splice(destination.index, 0, movedCard);

        sourceList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        // Update the order for each card in the destination list
        destList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        setOrderedData(newOrderedData);
        toast.info("feature WIP check again soon");

        // executeUpdateCardOrder({
        //   boardId: boardId,
        //   items: destList.cards,
        // });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="lists" direction="horizontal">
        {(provided) => {
          return (
            <ol
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex gap-x-3 h-full"
            >
              {orderedData?.map((list, index) => {
                return <ListItem key={list.id} index={index} data={list} />;
              })}
              {provided.placeholder}
              <CreateListForm />
              <div className="flex-shrink-0 w-1" />
            </ol>
          );
        }}
      </Droppable>
    </DragDropContext>
  );
};
