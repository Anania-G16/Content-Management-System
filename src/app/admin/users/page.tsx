"use client";

import { useState } from "react";
import { 
  Search, 
  MoreVertical, 
  UserPlus, 
  ShieldCheck, 
  User as UserIcon,
  UserX,
  UserCheck,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { dummyUsers, User, UserRole } from "@/data/userData";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(dummyUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Search filter matching name or email
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleMenu = (userId: string) => {
    setActiveMenuId(activeMenuId === userId ? null : userId);
  };

  // Toggle user activation state
  const handleToggleDeactivate = (userId: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.id === userId ? { ...u, isDeactivated: !u.isDeactivated } : u
      )
    );
    setActiveMenuId(null);
  };

  // Delete user from local state
  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userToDelete.id));
    setUserToDelete(null);
  };

  const getRoleBadge = (role: UserRole) => {
    if (role === "Admin") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
          <ShieldCheck size={12} />
          Admin
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/[0.05] text-text-secondary border border-white/[0.08]">
        <UserIcon size={12} />
        User
      </span>
    );
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-bold text-text tracking-tight">
            User Management
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage user accounts, roles, and system access.
          </p>
        </div>
        {/* <button
          type="button"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-text text-background font-medium text-sm hover:bg-white/90 transition-colors shadow-sm"
        >
          <UserPlus size={16} />
          Add User
        </button> */}
      </div>

      {/* Toolbar / Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#1a1a1a] border border-white/[0.08] text-sm text-text placeholder:text-text-secondary/60 focus:outline-none focus:border-white/20 transition-colors"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-white/[0.08] bg-[#1a1a1a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02] text-text-secondary text-xs font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Joined</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={`transition-colors group ${
                      user.isDeactivated ? "opacity-60 bg-white/[0.01]" : "hover:bg-white/[0.02]"
                    }`}
                  >
                    {/* User Name & Email */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-white/[0.08] border border-white/[0.1] flex items-center justify-center text-text font-medium text-xs">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div className="flex flex-col truncate">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-text truncate">
                              {user.name}
                            </span>
                            {user.isDeactivated && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                Deactivated
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-text-secondary truncate">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">
                      {getRoleBadge(user.role)}
                    </td>

                    {/* Joined Date */}
                    <td className="py-3.5 px-4 text-text-secondary text-xs">
                      {user.createdAt}
                    </td>

                    {/* Action Menu */}
                    <td className="py-3.5 px-4 text-right relative">
                      <button
                        onClick={() => toggleMenu(user.id)}
                        className="p-1.5 rounded-lg text-text-secondary hover:text-text hover:bg-white/[0.06] transition-colors"
                        aria-label="Actions"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuId === user.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActiveMenuId(null)}
                          />
                          <div className="absolute right-4 top-12 z-20 w-48 rounded-lg bg-[#222222] border border-white/[0.1] shadow-xl py-1 text-left">
                            {/* Deactivate / Reactivate Option */}
                            <button
                              onClick={() => handleToggleDeactivate(user.id)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-amber-300 hover:bg-amber-500/10 transition-colors"
                            >
                              {user.isDeactivated ? (
                                <>
                                  <UserCheck size={14} />
                                  Reactivate User
                                </>
                              ) : (
                                <>
                                  <UserX size={14} />
                                  Deactivate User
                                </>
                              )}
                            </button>

                            <div className="my-1 border-t border-white/[0.08]" />

                            {/* Delete Option */}
                            <button
                              onClick={() => {
                                setUserToDelete(user);
                                setActiveMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
                            >
                              <Trash2 size={14} />
                              Delete User
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="py-12 text-center text-text-secondary text-sm"
                  >
                    No users found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#1a1a1a] border border-white/[0.1] rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <AlertTriangle size={20} />
              </div>
              <h3 className="text-lg font-semibold text-text">Delete User Account</h3>
            </div>

            <p className="text-sm text-text-secondary leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold text-text">{userToDelete.name}</span> (
              {userToDelete.email})? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-sm text-text hover:bg-white/[0.08] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-rose-600 text-white font-medium text-sm hover:bg-rose-500 transition-colors shadow-sm"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}