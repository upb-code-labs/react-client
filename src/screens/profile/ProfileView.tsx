import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { UpdatePasswordForm } from "./components/UpdatePasswordForm";
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
            <TabsTrigger className="flex-grow" value="update-password">
              Update password
            </TabsTrigger>
          </TabsList>
          <TabsContent value="update-profile">
            <UpdateProfile />
          </TabsContent>
          <TabsContent value="update-password">
            <UpdatePasswordForm />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};
