import React from "react";

interface BoardPageProps {
  params: {
    boardId: string;
  };
}

const BoardPage = ({ params }: BoardPageProps) => {
  return (
    <div className="p-4 h-full overflow-x-auto">
      board
      {/* <ListContainer boardId={params.boardId} data={lists} /> */}
    </div>
  );
};

export default BoardPage;
