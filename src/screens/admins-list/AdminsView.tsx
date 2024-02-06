import { GenericTableSkeleton } from "@/components/Skeletons/GenericTableSkeleton";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { getRegisteredAdminsService } from "@/services/accounts/get-registered-admins.service";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

dayjs.extend(relativeTime);

export const AdminsView = () => {
  const {
    data: admins,
    isLoading: isAdminsLoading,
    isError: isAdminsError,
    error: adminsError
  } = useQuery({
    queryKey: ["admins"],
    queryFn: getRegisteredAdminsService
  });

  if (isAdminsLoading) {
    return (
      <div className="mx-auto max-w-7xl p-4">
        <GenericTableSkeleton
          columns={3}
          rows={8}
          headers={["Full name", "Creation date", "Created by"]}
        />
      </div>
    );
  }

  if (isAdminsError) {
    toast.error(adminsError.message);
  }

  return (
    <main className="mx-auto max-w-7xl p-4">
      <div className="mb-4 flex flex-row flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Administrators list</h1>
        <Link
          className={buttonVariants({ variant: "default" })}
          to="/register/admins"
        >
          <PlusCircle className="mr-2" />
          Register admin
        </Link>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full name</TableHead>
              <TableHead>Creation date</TableHead>
              <TableHead>Created by</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins?.length ? (
              admins?.map((admin) => (
                <TableRow key={`admin-row-${admin.uuid}`}>
                  <TableCell>{admin.full_name}</TableCell>
                  <TableCell>{dayjs(admin.created_at).fromNow()}</TableCell>
                  <TableCell>{admin.created_by}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </main>
  );
};
