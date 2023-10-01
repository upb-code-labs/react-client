import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { AuthContext } from "@/context/AuthContext";
import { SessionRole } from "@/hooks/useSession";
import { ClipboardCopy, EyeOff, MoreVertical, PenSquare } from "lucide-react";
import { useContext } from "react";

const getDropdownOptionsByRole = (role: SessionRole) => {
  if (role == "teacher") {
    return [
      {
        icon: PenSquare,
        text: "Update name"
      },
      {
        icon: ClipboardCopy,
        text: "Copy invitation code"
      }
    ];
  } else {
    return [];
  }
};

export const CourseDropDown = () => {
  const { user } = useContext(AuthContext);
  const role = user?.role || "student";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="absolute right-4 top-4"
          aria-label="Toggle course options menu"
        >
          <MoreVertical />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Course options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <EyeOff className="mr-2 h-4 w-4" />
          <span>Hide course</span>
        </DropdownMenuItem>
        {getDropdownOptionsByRole(role).map((option) => (
          <DropdownMenuItem key={option.text}>
            <option.icon className="mr-2 h-4 w-4" />
            <span>{option.text}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
