
import { ListContainer } from "@/components/lists/list-container";

interface BoardIdPageProps {
  params: {
    boardId: string;
  };
}

const BoardIdPage = ({ params }: BoardIdPageProps) => {
  return (
    <div className="p-4 h-full overflow-x-auto">
      <ListContainer boardId={params.boardId} />
    </div>
  );
};

export default BoardIdPage;
