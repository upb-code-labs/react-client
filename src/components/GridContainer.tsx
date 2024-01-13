import { ReactNode } from "react";

export const GridContainer = ({ children }: { children?: ReactNode[] }) => {
  return (
    <section className="grid w-full grid-cols-[repeat(auto-fill,minmax(250px,1fr))] items-center gap-8">
      {children}
    </section>
  );
};
