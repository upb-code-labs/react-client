import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../ui/table";

interface GenericTableSkeletonProps {
  rows: number;
  columns: number;
  headers: string[];
}

export const GenericTableSkeleton = ({
  rows,
  columns,
  headers
}: GenericTableSkeletonProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={`table-skeleton-${header}`}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array(rows)
            .fill(0)
            .map((_, i) => (
              <TableRow key={`table-skeleton-row-${i}`}>
                {Array(columns)
                  .fill(0)
                  .map((_, j) => (
                    <TableCell key={`table-skeleton-cell-${i}-${j}`}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};
