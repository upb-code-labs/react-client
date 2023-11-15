import { buttonVariants } from "@/components/ui/button";
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
} from "@/services/accounts/get-registered-admins.service";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

dayjs.extend(relativeTime);

export const AdminsView = () => {
  const [admins, setAdmins] = useState<registeredAdminDTO[]>();

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
    <main className="mx-auto max-w-7xl px-4">
      <div className="mb-2 flex flex-row flex-wrap items-center justify-between gap-x-4">
        <h1 className="my-4 text-3xl font-bold">Current registered admins</h1>
        <Link
          className={buttonVariants({ variant: "default" })}
          to="/register/admins"
        >
          <PlusCircle className="mr-2" />
          Register admin
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Creation Date</TableHead>
            <TableHead>Created By</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins?.map((admin) => (
            <TableRow key={admin.uuid}>
              <TableCell>{admin.full_name}</TableCell>
              <TableCell>{dayjs(admin.created_at).fromNow()}</TableCell>
              <TableCell>{admin.created_by}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
};
