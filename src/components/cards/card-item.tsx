"use client";

import { Draggable } from "@hello-pangea/dnd";
import { TaskApp_Card } from "@prisma/client";
import { useState } from "react";

interface CardItemProps {
  data: TaskApp_Card;
  index: number;
}

export const CardItem = ({ data, index }: CardItemProps) => {
  const [cardId, setCardId] = useState<string>();

  return (
    // <Draggable draggableId={data.id} index={index}>
    //   {(provided) => (
    //     <div
    //       {...provided.draggableProps}
    //       {...provided.dragHandleProps}
    //       ref={provided.innerRef}
    //       role="button"
    //       onClick={() => setCardId(data.id)}
    //       className="truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm"
    //     >
    //       {data.title}
    //     </div>
    //   )}
    // </Draggable>
    <div key={index}>
      <div
        role="button"
        onClick={() => setCardId(data.id)}
        className="truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm"
      >
        {data.title}
      </div>
    </div>
  );
};
