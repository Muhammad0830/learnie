"use client";

import { ColumnDef } from "@tanstack/react-table";
import TableActionButton from "@/components/courses/TableActionButton";
import { Course } from "@/types/types";

export const columns = (refetch: () => void): ColumnDef<Course>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <div className="h-full lg:max-w-[350px] md:max-w-[250px] max-w-[200px] overflow-hidden relative truncate">
          {row.original.name}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      return (
        <div className="h-full lg:max-w-[350px] md:max-w-[250px] max-w-[200px] overflow-hidden relative truncate">
          {row.original.description}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const createdAt = new Date(row.original.created_at);
      const hours = createdAt.getHours().toString().padStart(2, "0");
      const minutes = createdAt.getMinutes().toString().padStart(2, "0");
      return (
        <div className="flex gap-1">
          {createdAt.toLocaleDateString()}{" "}
          <span className="lg:flex md:hidden flex">
            {hours}:{minutes}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const payment = row.original;

      return <TableActionButton payment={payment} refetch={refetch} />;
    },
  },
];
