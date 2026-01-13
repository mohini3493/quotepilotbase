import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ cookies() IS ASYNC
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin_token")?.value;

  if (!adminToken) {
    redirect("/admin-login");
  }

  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
  //   headers: {
  //     Cookie: `admin_token=${adminToken}`,
  //   },
  //   cache: "no-store",
  // });

  // if (!res.ok) {
  //   redirect("/admin-login");
  // }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
