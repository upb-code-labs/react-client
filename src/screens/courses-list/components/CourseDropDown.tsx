import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { AuthContext } from "@/context/AuthContext";
import { UserCoursesDialogsContext } from "@/context/courses/UserCoursesDialogsContext";
import { CoursesState } from "@/hooks/courses/useCourses";
import { SessionRole } from "@/hooks/useSession";
import { getInvitationCodeService } from "@/services/courses/get-invitation-code.service";
import { toggleCourseVisibilityService } from "@/services/courses/toggle-course-visibility.service";
import { Course } from "@/types/entities/general-entities";
import { copyToClipboard } from "@/utils/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  const { openRenameCourseDialog } = useContext(UserCoursesDialogsContext);

  const { user } = useContext(AuthContext);
  const role = user?.role || "student";

  // Courses mutations
  const queryClient = useQueryClient();
  const { mutate: toggleCourseVisibilityMutation } = useMutation({
    mutationFn: toggleCourseVisibilityService,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      const { visible } = data;

      // Show a success toast
      toast.success(
        visible ? "Course shown successfully" : "Course hidden successfully"
      );

      // Update courses query
      queryClient.setQueryData<CoursesState>(
        ["courses"],
        (oldData: CoursesState | undefined) => {
          if (!oldData) return oldData;

          if (visible) {
            // Remove the course from the hidden courses list
            const hiddenCourses = oldData.hiddenCourses.filter(
              (hiddenCourse) => hiddenCourse.uuid != course.uuid
            );

            // Add the course to the courses list
            const courses = [...oldData.courses, course];

            return {
              ...oldData,
              courses,
              hiddenCourses
            };
          } else {
            // Remove the course from the courses list
            const courses = oldData.courses.filter(
              (course) => course.uuid != course.uuid
            );

            // Add the course to the hidden courses list
            const hiddenCourses = [...oldData.hiddenCourses, course];

            return {
              ...oldData,
              courses,
              hiddenCourses
            };
          }
        }
      );
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
