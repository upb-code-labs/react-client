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
import { toggleCourseVisibilityNewService } from "@/services/courses/toggle-course-visibility.service";
import { Course } from "@/types/entities/general-entities";
import { copyToClipboard } from "@/utils/utils";
import { useMutation } from "@tanstack/react-query";
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
  course: Course;
  isHidden: boolean;
}

export const CourseDropDown = ({ course, isHidden }: CourseDropDownProps) => {
  const { userCoursesDispatcher, openRenameCourseDialog } =
    useContext(UserCoursesContext);

  const { user } = useContext(AuthContext);
  const role = user?.role || "student";

  // Courses mutations
  const { mutate: toggleCourseVisibilityMutation } = useMutation({
    mutationFn: toggleCourseVisibilityNewService,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      const { visible } = data;

      // Show a success toast
      toast.success(
        visible ? "Course shown successfully" : "Course hidden successfully"
      );

      // Update courses state
      userCoursesDispatcher({
        type: visible
          ? CoursesActionType.SHOW_COURSE
          : CoursesActionType.HIDE_COURSE,
        payload: {
          uuid: course.uuid
        }
      });
    }
  });

  const getDropdownOptionsByRole = (role: SessionRole) => {
    if (role == "teacher") {
      return [
        {
          icon: PenSquare,
          text: "Rename course",
          callback: () => openRenameCourseDialog(course)
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
    const { success, ...response } = await getInvitationCodeService(
      course.uuid
    );

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

  const hideCourse = () => toggleCourseVisibilityMutation(course.uuid);

  const showCourse = () => toggleCourseVisibilityMutation(course.uuid);

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
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            isHidden ? showCourse() : hideCourse();
          }}
        >
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
          <DropdownMenuItem
            key={option.text}
            onClick={(e) => {
              e.stopPropagation();
              option.callback();
            }}
          >
            <option.icon className="mr-2 h-4 w-4" />
            <span>{option.text}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
