"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShieldCheck,
  Shield,
  Briefcase,
  ClipboardList,
  Plus,
  Trash2,
  X,
  Pencil,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";

type AdminUser = {
  id: number;
  email: string;
  role: "superadmin" | "admin" | "lead_manager" | "product_manager";
  created_at: string;
};

type EditState = {
  email: string;
  role: string;
  newPassword: string;
  showPassword: boolean;
  saving: boolean;
  error: string | null;
};

const ROLE_OPTIONS = [
  { value: "superadmin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "lead_manager", label: "Lead Manager" },
  { value: "product_manager", label: "Product Manager" },
];

const ROLE_META: Record<string, { label: string; icon: any; color: string; access: string }> = {
  superadmin: { label: "Super Admin", icon: ShieldCheck, color: "bg-primary/10 text-primary", access: "Dashboard · Users · Lead Details · Product Details" },
  admin: { label: "Admin", icon: Shield, color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400", access: "Dashboard · Lead Details · Product Details" },
  lead_manager: { label: "Lead Manager", icon: ClipboardList, color: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400", access: "Dashboard · Lead Details" },
  product_manager: { label: "Product Manager", icon: Briefcase, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400", access: "Dashboard · Product Details" },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", role: "admin", showPassword: false });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editState, setEditState] = useState<EditState | null>(null);

  async function loadUsers() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin-users", { credentials: "include" });
      if (!res.ok) throw new Error();
      setUsers(await res.json());
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(user: AdminUser) {
    setEditingId(user.id);
    setEditState({ email: user.email, role: user.role, newPassword: "", showPassword: false, saving: false, error: null });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditState(null);
  }

  async function saveEdit(id: number) {
    if (!editState) return;
    setEditState((s) => s && ({ ...s, saving: true, error: null }));

    try {
      // Save email + role
      const res = await fetch(`/api/admin-users/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: editState.email, role: editState.role }),
      });
      if (!res.ok) {
        const data = await res.json();
        setEditState((s) => s && ({ ...s, saving: false, error: data.error || "Failed to save" }));
        return;
      }

      // Change password if provided
      if (editState.newPassword) {
        const pwRes = await fetch(`/api/admin-users/${id}/password`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: editState.newPassword }),
        });
        if (!pwRes.ok) {
          const data = await pwRes.json();
          setEditState((s) => s && ({ ...s, saving: false, error: data.error || "Failed to update password" }));
          return;
        }
      }

      cancelEdit();
      loadUsers();
    } catch {
      setEditState((s) => s && ({ ...s, saving: false, error: "Failed to save changes" }));
    }
  }

  async function createUser() {
    if (!form.email || !form.password) {
      setFormError("Email and password are required");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      const res = await fetch("/api/admin-users", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password, role: form.role }),
      });
      if (!res.ok) {
        const data = await res.json();
        setFormError(data.error || "Failed to create user");
        return;
      }
      setForm({ email: "", password: "", role: "admin", showPassword: false });
      setShowForm(false);
      loadUsers();
    } catch {
      setFormError("Failed to create user");
    } finally {
      setSaving(false);
    }
  }

  async function deleteUser(id: number) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const res = await fetch(`/api/admin-users/${id}`, { method: "DELETE", credentials: "include" });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Failed to delete user");
      return;
    }
    loadUsers();
  }

  useEffect(() => { loadUsers(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
        <p className="text-destructive font-medium">{error}</p>
        <Button variant="outline" size="sm" onClick={loadUsers} className="mt-3">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage admin users and their access roles</p>
        </div>
        <Button onClick={() => { setShowForm(true); setFormError(null); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Role legend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {Object.entries(ROLE_META).map(([key, meta]) => {
          const Icon = meta.icon;
          return (
            <div key={key} className={`flex items-start gap-2.5 p-3 rounded-lg border ${meta.color} border-current/10`}>
              <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold">{meta.label}</p>
                <p className="text-[10px] opacity-75 mt-0.5 leading-relaxed">{meta.access}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add User Form */}
      {showForm && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">New User</h2>
              <button onClick={() => setShowForm(false)}><X className="w-4 h-4 text-muted-foreground hover:text-foreground" /></button>
            </div>
            {formError && <p className="text-sm text-destructive">{formError}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <Input type="email" placeholder="user@example.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Password</label>
                <div className="relative">
                  <Input
                    type={form.showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, showPassword: !form.showPassword })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {form.showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Role</label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  {ROLE_OPTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={createUser} disabled={saving}>{saving ? "Creating..." : "Create User"}</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users List */}
      <div className="space-y-2">
        {users.map((user) => {
          const meta = ROLE_META[user.role] || ROLE_META.admin;
          const Icon = meta.icon;
          const isEditing = editingId === user.id;

          return (
            <div key={user.id} className="border rounded-lg bg-card overflow-hidden">
              {/* Row */}
              <div className="flex items-center gap-4 p-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${meta.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{user.email}</p>
                  <p className="text-xs text-muted-foreground">Joined {new Date(user.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${meta.color}`}>
                  {meta.label}
                </span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button variant="secondary" size="sm" onClick={() => isEditing ? cancelEdit() : startEdit(user)}>
                    {isEditing ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                    <span className="ml-1">{isEditing ? "Cancel" : "Edit"}</span>
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteUser(user.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Edit panel */}
              {isEditing && editState && (
                <div className="border-t bg-muted/30 p-4 space-y-4">
                  {editState.error && (
                    <p className="text-sm text-destructive">{editState.error}</p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Email</label>
                      <Input
                        type="email"
                        value={editState.email}
                        onChange={(e) => setEditState((s) => s && ({ ...s, email: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Role</label>
                      <select
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        value={editState.role}
                        onChange={(e) => setEditState((s) => s && ({ ...s, role: e.target.value }))}
                      >
                        {ROLE_OPTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        New Password <span className="text-muted-foreground font-normal">(leave blank to keep)</span>
                      </label>
                      <div className="relative">
                        <Input
                          type={editState.showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={editState.newPassword}
                          onChange={(e) => setEditState((s) => s && ({ ...s, newPassword: e.target.value }))}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setEditState((s) => s && ({ ...s, showPassword: !s.showPassword }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {editState.showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={() => saveEdit(user.id)} disabled={editState.saving}>
                      <Check className="w-4 h-4 mr-1" />
                      {editState.saving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button variant="outline" onClick={cancelEdit}>Cancel</Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {users.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No users found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
