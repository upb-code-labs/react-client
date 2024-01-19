import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";

export const GradingSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  return (
    <aside
      className={`border-l pl-4
    ${isCollapsed ? "w-min" : "w-2/5"}
    `}
    >
      <Button
        variant={"outline"}
        onClick={toggleCollapse}
        aria-label={`${isCollapsed ? "Expand" : "Collapse"} grading sidebar`}
        className="hidden md:block"
      >
        {isCollapsed ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </Button>
    </aside>
  );
};
