import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ChangePasswordForm } from "./components/ChangePasswordForm";
import { UpdateProfile } from "./components/UpdateProfile";

export const ProfileView = () => {
  return (
    <div className="px-4">
      <main className="mx-auto my-4 max-w-md rounded-md border p-4">
        <Tabs defaultValue="update-profile">
          <TabsList className="w-full">
            <TabsTrigger className="flex-grow" value="update-profile">
              Update profile
            </TabsTrigger>
            <TabsTrigger className="flex-grow" value="change-password">
              Change password
            </TabsTrigger>
          </TabsList>
          <TabsContent value="update-profile">
            <UpdateProfile />
          </TabsContent>
          <TabsContent value="change-password">
            <ChangePasswordForm />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};
