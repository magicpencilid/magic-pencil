/* =============================================
   📐 ADMIN MAIN LAYOUT — Auth Check + Sidebar
   
   - Cek session cookie → redirect ke /admin/login
   - Tampilkan sidebar + konten
   ============================================= */

import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import AdminSidebar from "@/components/AdminSidebar";

export const metadata = {
  title: "Admin | Magic Pencil",
};

export default async function AdminMainLayout({ children }) {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
