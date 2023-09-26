import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  getRegisteredAdminsService,
  registeredAdminDTO
} from "@/services/accounts/accounts.services";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

dayjs.extend(relativeTime);

export const AdminsView = () => {
  const [admins, setAdmins] = useState<registeredAdminDTO[]>();
  const navigate = useNavigate();

  const getRegisteredAdmins = async () => {
    const { success, admins, ...response } = await getRegisteredAdminsService();
    if (success) {
      setAdmins(admins);
    } else {
      toast.error(response.message);
    }
  };

  useEffect(() => {
    getRegisteredAdmins();
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4">
      <div className="flex flex-row items-center justify-between flex-wrap mb-2 gap-x-4">
        <h1 className="font-bold text-3xl my-4">Current registered admins</h1>
        <Button onClick={() => navigate("/register/admins")}>
          <PlusCircle className="mr-3" />
          Register admin
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Creation Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins?.map((admin) => (
            <TableRow key={`${admin.full_name}`.replace(" ", "").toLowerCase()}>
              <TableCell>{admin.full_name}</TableCell>
              <TableCell>{dayjs(admin.created_at).fromNow()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
};
