import { Plus } from "lucide-react";

interface ActionButtonProps {
  text: string;
  onClickCallback: () => void;
}

export const ActionButton = ({ text, onClickCallback }: ActionButtonProps) => {
  return (
    <button
      className="grid aspect-square w-full max-w-[18rem] flex-shrink-0 place-content-center gap-2 border p-4 text-xl font-medium shadow-md transition-colors hover:shadow-lg sm:w-72"
      onClick={onClickCallback}
    >
      <Plus size={64} strokeWidth={1} className="mx-auto" />
      {text}
    </button>
  );
};
