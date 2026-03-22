"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslations } from "next-intl";
import LoadingSkeleton from "../LoadingSkeleton";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;
  translateFrom: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  translateFrom,
}: DataTableProps<TData, TValue>) {
  const t = useTranslations(translateFrom);

  // eslint-disable-next-line
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <LoadingSkeleton table={table} />;

  if (!data || !columns) {
    console.error("Data or columns are not defined");
    return null;
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              className="bg-primary/40 hover:bg-primary/50 dark:hover:bg-primary/30"
              key={headerGroup.id}
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    className={cn(
                      "h-10",
                      header.column.id === "actions" &&
                        "flex justify-center items-center",
                    )}
                    key={header.id}
                  >
                    {t(
                      String(
                        header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            ),
                      ),
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                className={cn(
                  "max-w-[300px] bg-primary/20 dark:bg-primary/20 hover:bg-primary/30 dark:hover:bg-primary/15",
                  ((row.original as any)?.isPendingAdd || // eslint-disable-line
                    (row.original as any)?.isPendingRemove) && // eslint-disable-line
                    "bg-primary/10 hover:bg-primary/10 dark:bg-primary/10 dark:hover:bg-primary/10",
                )}
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {t("No results")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
