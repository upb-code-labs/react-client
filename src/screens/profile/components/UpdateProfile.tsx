import { CustomError } from "@/components/CustomError";
import { getUserProfileService } from "@/services/accounts/get-user-profile.service";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { UpdateProfileSkeleton } from "../skeletons/UpdateProfileSkeleton";
import { UpdateProfileForm } from "./UpdateProfileForm";

export const UpdateProfile = () => {
  const {
    data: profile,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getUserProfileService
  });

  // Handle loading state
  if (isLoading) return <UpdateProfileSkeleton />;

  // Handle error state
  if (isError) {
    toast.error(error.message);
    return (
      <CustomError
        className="mt-4 w-full border-none shadow-none"
        title="We couldn't load your profile"
        message={error.message}
        showFooter={false}
      />
    );
  }

  // Show an error if the profile is not loading but it's undefined
  if (!profile)
    return (
      <CustomError
        className="mt-4 w-full border-none shadow-none"
        title="We couldn't load your profile"
        showFooter={false}
      />
    );

  return (
    <div>
      {/* First letter of the user's full name */}
      <span className="mx-auto my-4 grid aspect-square w-1/5 place-content-center rounded-md bg-purple-upb text-2xl font-bold text-white">
        {profile.full_name[0]}
      </span>
      {/* Form to update the information */}
      <UpdateProfileForm profile={profile} />
    </div>
  );
};
