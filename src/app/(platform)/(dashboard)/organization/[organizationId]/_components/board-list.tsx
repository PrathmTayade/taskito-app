import CreateBoardFormModal from "@/components/create-board-form";
import { Button } from "@/components/ui/button";
import { TaskApp_Board } from "@prisma/client";
import { User2 } from "lucide-react";
import Link from "next/link";
import { FC } from "react";


interface BoardListProps {
  boards: TaskApp_Board[];
}

const BoardList: FC<BoardListProps> = ({ boards }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center font-semibold text-lg text-neutral-700">
        <User2 className="h-6 w-6 mr-2" />
        Your boards
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {boards.map((board) => (
          <Link
            key={board.id}
            href={`/board/${board.id}`}
            className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 rounded-sm h-full w-full p-2 overflow-hidden"
            style={{ backgroundImage: `url(${board.imageThumbUrl})` }}
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
            <p className="relative font-semibold text-white">{board.title}</p>
          </Link>
        ))}
        {/* <FormPopover>
          <div
            role="button"
            className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
          >
            <p className="text-sm">Create new board</p>
            <span className="text-xs">
              {false ? "Unlimited" : `5 remaining`}
              {isPro
                ? "Unlimited"
                : `${MAX_FREE_BOARDS - availableCount} remaining`}
            </span>
            <Hint
              sideOffset={40}
              description={`
                Free Workspaces can have up to 5 open boards. For unlimited boards upgrade this workspace.
              `}
            >
              <HelpCircle className="absolute bottom-2 right-2 h-[14px] w-[14px]" />
            </Hint>
          </div>
        </FormPopover> */}
        {/* create board */}
        <CreateBoardFormModal>
          <Button
            variant="outline"
            className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col shadow gap-y-1 items-center justify-center hover:opacity-75 transition"
          >
            <p className="text-sm">Create new board</p>
          </Button>
        </CreateBoardFormModal>
      </div>
    </div>
  );
};

export default BoardList;
