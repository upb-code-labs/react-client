import { ReactNode } from "react";

export const ButtonIconContainer = ({ Icon }: { Icon: ReactNode }) => {
  return (
    <div className="grid aspect-square w-[45%] place-items-center rounded-2xl bg-gradient-to-r from-red-upb to-purple-upb hover:from-red-upb/90 hover:to-purple-upb/90">
      {Icon}
    </div>
  );
};
