import { Plus } from "lucide-react";

interface ActionButtonProps {
  text: string;
  onClick: () => void;
}

export const ActionButton = ({ text, onClick }: ActionButtonProps) => {
  return (
    <button
      className="grid aspect-square w-1/4 place-content-center gap-2 border p-4 text-xl font-medium shadow-md transition-colors hover:shadow-lg"
      onClick={onClick}
    >
      <Plus size={64} strokeWidth={1} className="mx-auto" />
      {text}
    </button>
  );
};
