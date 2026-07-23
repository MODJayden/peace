import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { fetchUsers, updateUserRole, banUser, unbanUser } from "@/features/admin/adminSlice";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/form-elements";
import { Pagination } from "@/components/common/Pagination";
import { useAuth } from "@/hooks/useAuth";
import { useDocumentHead } from "@/hooks/useDocumentHead";

const ROLES = ["subscriber", "author", "editor", "admin", "super_admin"];

export default function AdminUsersPage() {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.admin);
  const { isSuperAdmin } = useAuth();
  const [roleFilter, setRoleFilter] = useState("");

  useDocumentHead({ title: "Manage Users", noIndex: true });

  useEffect(() => {
    dispatch(fetchUsers({ page: 1, role: roleFilter || undefined }));
  }, [dispatch, roleFilter]);

  const assignableRoles = isSuperAdmin ? ROLES : ROLES.filter((r) => r !== "super_admin");

  const handleRoleChange = async (id, role) => {
    try {
      await dispatch(updateUserRole({ id, role })).unwrap();
      toast.success("Role updated");
    } catch (err) {
      toast.error(err || "Could not update role");
    }
  };

  const handleBanToggle = async (user) => {
    if (user.isBanned) {
      await dispatch(unbanUser(user._id)).unwrap();
      toast.success("User unbanned");
    } else {
      const reason = window.prompt("Reason for ban (optional):") || "";
      await dispatch(banUser({ id: user._id, reason })).unwrap();
      toast.success("User banned");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">Manage Users</h1>
        <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="w-48">
          <option value="">All roles</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r.replace("_", " ")}
            </option>
          ))}
        </Select>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-line">
        <table className="w-full text-sm">
          <thead className="border-b border-line bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {users.results.map((user) => (
              <tr key={user._id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar src={user.avatar?.url} name={user.name} size={32} />
                    <div>
                      <p className="font-medium text-ink">{user.name}</p>
                      <p className="text-xs text-muted">@{user.username}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    disabled={user.role === "super_admin" && !isSuperAdmin}
                    className="w-40"
                  >
                    {assignableRoles.map((r) => (
                      <option key={r} value={r}>
                        {r.replace("_", " ")}
                      </option>
                    ))}
                  </Select>
                </td>
                <td className="px-4 py-3">
                  {user.isBanned ? <Badge variant="breaking">Banned</Badge> : <Badge variant="accent">Active</Badge>}
                </td>
                <td className="px-4 py-3">
                  {user.role !== "super_admin" && (
                    <Button size="sm" variant={user.isBanned ? "outline" : "destructive"} onClick={() => handleBanToggle(user)}>
                      {user.isBanned ? "Unban" : "Ban"}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination pagination={users.pagination} onPageChange={(page) => dispatch(fetchUsers({ page }))} />
    </div>
  );
}
