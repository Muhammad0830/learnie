"use client";

import { Table as TableType, flexRender } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingSkeleton = <TData,>({ table }: { table: TableType<TData> }) => {
  const t = useTranslations("Students");

  const headers = table.getHeaderGroups()[0].headers;

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
                  <TableHead className="h-10" key={header.id}>
                    {t(
                      String(
                        header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )
                      )
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {[1, 2, 3, 4, 5].map((row) => (
            <TableRow key={row}>
              {headers.map((header) => (
                <TableCell key={header.id} className="h-12">
                  <Skeleton className="w-full h-4 bg-primary/30" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LoadingSkeleton;
