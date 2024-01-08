import React from "react";

interface BoardPageProps {
  params: {
    boardId: string;
  };
}

const BoardPage = ({ params }: BoardPageProps) => {
  return (
    <div className="my-8">
      <div>Board Page</div>
      <div>{params.boardId}</div>
    </div>
  );
};

export default BoardPage;
