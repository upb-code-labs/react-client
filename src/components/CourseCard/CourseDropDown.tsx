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
import { getInvitationCodeService } from "@/services/courses/get-invitation-code.service";
import { copyToClipboard } from "@/utils/copy-to-clipboard";
import { ClipboardCopy, EyeOff, MoreVertical, PenSquare } from "lucide-react";
import { useContext } from "react";
import { toast } from "sonner";

interface CourseDropDownProps {
  courseUUID: string;
}

export const CourseDropDown = ({ courseUUID }: CourseDropDownProps) => {
  const { user } = useContext(AuthContext);
  const role = user?.role || "student";

  const getDropdownOptionsByRole = (role: SessionRole) => {
    if (role == "teacher") {
      return [
        {
          icon: PenSquare,
          text: "Update name",
          callback: () => console.log("To be implemented")
        },
        {
          icon: ClipboardCopy,
          text: "Copy invitation code",
          callback: getInvitationCode
        }
      ];
    } else {
      return [];
    }
  };

  const getInvitationCode = async () => {
    const { success, ...response } = await getInvitationCodeService(courseUUID);
    if (!success) {
      toast.error(response.message);
      return;
    }

    const { code } = response;
    copyInvitationCode(code);
  };

  const copyInvitationCode = async (code: string) => {
    const copied = await copyToClipboard(code);
    if (copied) {
      toast.success(`Invitation code ${code} copied to clipboard`);
    } else {
      toast.error("Couldn't copy invitation code to clipboard");
    }
  };

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
          <DropdownMenuItem key={option.text} onClick={option.callback}>
            <option.icon className="mr-2 h-4 w-4" />
            <span>{option.text}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
