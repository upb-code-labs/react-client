import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { AuthContext } from "@/context/AuthContext";
import { UserCoursesContext } from "@/context/courses/UserCoursesContext";
import { CoursesActionType } from "@/hooks/courses/coursesReducer";
import { SessionRole } from "@/hooks/useSession";
import { getInvitationCodeService } from "@/services/courses/get-invitation-code.service";
import { copyToClipboard } from "@/utils/copy-to-clipboard";
import {
  ClipboardCopy,
  Eye,
  EyeOff,
  MoreVertical,
  PenSquare
} from "lucide-react";
import { useContext } from "react";
import { toast } from "sonner";

interface CourseDropDownProps {
  courseUUID: string;
  isHidden: boolean;
}

export const CourseDropDown = ({
  courseUUID,
  isHidden
}: CourseDropDownProps) => {
  const { userCoursesDispatcher } = useContext(UserCoursesContext);
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

  const hideCourse = () => {
    userCoursesDispatcher({
      type: CoursesActionType.HIDE_COURSE,
      payload: {
        uuid: courseUUID
      }
    });
  };

  const showCourse = () => {
    userCoursesDispatcher({
      type: CoursesActionType.SHOW_COURSE,
      payload: {
        uuid: courseUUID
      }
    });
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
        <DropdownMenuItem onClick={isHidden ? showCourse : hideCourse}>
          {isHidden ? (
            <>
              <Eye className="mr-2 h-4 w-4" />
              <span>Show course</span>
            </>
          ) : (
            <>
              <EyeOff className="mr-2 h-4 w-4" />
              <span>Hide course</span>
            </>
          )}
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
