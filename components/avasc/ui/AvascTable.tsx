import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils/cn";

export type AvascTableProps = React.ComponentProps<typeof Table>;

function AvascTable({ className, ...props }: AvascTableProps) {
  return <Table className={cn("rounded-xl", className)} {...props} />;
}

export {
  AvascTable,
  TableHeader as AvascTableHeader,
  TableBody as AvascTableBody,
  TableRow as AvascTableRow,
  TableHead as AvascTableHead,
  TableCell as AvascTableCell,
};
