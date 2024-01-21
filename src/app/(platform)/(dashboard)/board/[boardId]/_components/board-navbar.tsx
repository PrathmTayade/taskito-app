import { TaskApp_Board } from "@prisma/client";
import { BoardOptions } from "./board-options";

interface BoardNavbarProps {
  data: TaskApp_Board;
}

export const BoardNavbar = async ({ data }: BoardNavbarProps) => {
  return (
    <div className="w-full h-14 z-[40] bg-black/50 fixed top-14 flex items-center px-6 gap-x-4 text-white">
      {/* //TODO */}
      {/* Form to edit the name of the board */}
      {/* <BoardTitleForm data={data} /> */}
      <h1 className="text-xl font-bold ">{data.title}</h1>
      <div className="ml-auto">
        <BoardOptions id={data.id} />
      </div>
    </div>
  );
};
