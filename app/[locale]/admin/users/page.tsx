import { redirect } from "next/navigation";
import { getPrisma } from "@/lib/prisma";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/admin/format";
import { submitUserRole } from "./user-form-actions";
import { requireStaff } from "@/lib/admin/session";
import { canManageUsers } from "@/lib/admin/permissions";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const staff = await requireStaff();
  if (!canManageUsers(staff.role)) {
    redirect("/admin");
  }

  const prisma = getPrisma();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="space-y-6">
      <div>
        <AdminBreadcrumbs items={[{ label: "Overview", href: "/admin" }, { label: "Users" }]} />
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Users & roles</h1>
        <p className="mt-1 text-sm text-slate-600">
          Promote staff accounts to moderator, viewer, or admin. IDs match Supabase `auth.users`.
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email / name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Change role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell>
                <p className="font-medium text-slate-900">{u.email ?? "—"}</p>
                <p className="text-sm text-slate-600">{u.displayName ?? ""}</p>
                <p className="font-mono text-[11px] text-slate-400">{u.id}</p>
              </TableCell>
              <TableCell>
                <Badge className="capitalize">{u.role}</Badge>
              </TableCell>
              <TableCell className="text-sm">{formatDate(u.createdAt)}</TableCell>
              <TableCell>
                <form action={submitUserRole} className="flex flex-wrap items-center gap-2">
                  <input type="hidden" name="userId" value={u.id} />
                  <select
                    name="role"
                    defaultValue={u.role}
                    className="h-9 rounded-lg border border-slate-200 px-2 text-sm"
                  >
                    <option value="victim">victim</option>
                    <option value="moderator">moderator</option>
                    <option value="admin">admin</option>
                  </select>
                  <Button type="submit" size="sm" variant="secondary" disabled={u.id === staff.userId}>
                    Save
                  </Button>
                </form>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
