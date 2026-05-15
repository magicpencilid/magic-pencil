/* =============================================
   📌 ADMIN SIDEBAR — Monochrome Gallery Style
   Hitam, putih, abu-abu aja.
   ============================================= */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  UserCheck,
  Calendar,
  DollarSign,
  LayoutDashboard,
  LogOut,
  BookOpen,
  Clock,
  PanelRightClose,
  PanelRightOpen,
  Palette,
  CheckCheck,
  ImageIcon,
  MessageSquare,
  ShoppingBag,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: UserCheck, label: "Murid", href: "/admin/murid" },
  { icon: Users, label: "Pendaftar", href: "/admin/pendaftar" },
  { icon: BookOpen, label: "Kelas & Investasi", href: "/admin/kelas" },
  { icon: Clock, label: "Hari & Jam", href: "/admin/jadwal-opsi" },
  { icon: Calendar, label: "Jadwal", href: "/admin/jadwal" },
  { icon: CheckCheck, label: "Absensi", href: "/admin/absensi" },
  { icon: Palette, label: "Karya", href: "/admin/karya" },
  { icon: ImageIcon, label: "Galeri Foto", href: "/admin/galeri-foto" },
  { icon: ShoppingBag, label: "Produk", href: "/admin/produk" },
  { icon: MessageSquare, label: "Testimoni", href: "/admin/testimoni" },
  { icon: DollarSign, label: "Pembayaran", href: "/admin/pembayaran" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [pendingCount, setPendingCount] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setPendingCount(data.pendingVerifikasi || 0);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const SidebarContent = ({ collapsed }) => (
    <>
      {/* Header */}
      <Link href="/admin" className={`block mb-6 ${collapsed ? "text-center" : ""}`}>
        {collapsed ? (
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center mx-auto">
            <Palette className="w-5 h-5 text-white" />
          </div>
        ) : (
          <>
            <p className="text-xs text-text-light uppercase tracking-wider font-semibold">Admin Panel</p>
            <p className="text-sm font-bold text-primary">Magic Pencil</p>
          </>
        )}
      </Link>

      {/* Menu */}
      <nav className="space-y-1 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const isPembayaran = item.href === "/admin/pembayaran";

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
                isActive
                  ? "bg-gray-100 text-primary font-semibold"
                  : "text-text-light hover:bg-gray-50 hover:text-primary"
              } ${collapsed ? "justify-center px-2" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && isPembayaran && pendingCount > 0 && (
                <span className="ml-auto bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                  {pendingCount > 99 ? "99+" : pendingCount}
                </span>
              )}
              {collapsed && isPembayaran && pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {pendingCount > 9 ? "!" : pendingCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="pt-6 border-t border-gray-100 space-y-2">
        <button
          onClick={async () => {
            await fetch("/api/admin/logout", { method: "POST" });
            window.location.href = "/admin/login";
          }}
          className={`flex items-center gap-2 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors w-full text-left ${
            collapsed ? "justify-center px-2" : ""
          }`}
          title={collapsed ? "Keluar" : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && "Keluar"}
        </button>
        <Link
          href="/"
          className={`flex items-center gap-2 px-3 py-2.5 text-sm text-text-light hover:text-primary rounded-xl transition-colors ${
            collapsed ? "justify-center px-2" : ""
          }`}
          title={collapsed ? "Kembali ke Website" : undefined}
        >
          <LogOut className="w-4 h-4 rotate-180 shrink-0" />
          {!collapsed && "Kembali ke Website"}
        </Link>
      </div>

      {/* Collapse toggle (desktop) */}
      {!collapsed && (
        <button
          onClick={() => setIsCollapsed(true)}
          className="hidden lg:flex items-center gap-2 mt-4 px-3 py-2 text-xs text-text-light hover:text-primary rounded-xl hover:bg-gray-50 transition-colors w-full"
        >
          <PanelRightClose className="w-4 h-4" />
          Ciutkan Sidebar
        </button>
      )}
    </>
  );

  return (
    <>
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-gray-200 min-h-screen p-4 shrink-0 transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="self-end mb-2 p-1 text-text-light hover:text-primary rounded-lg hover:bg-gray-100 transition-colors"
            title="Perluas Sidebar"
          >
            <PanelRightOpen className="w-4 h-4" />
          </button>
        )}
        <SidebarContent collapsed={isCollapsed} />
      </aside>

      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed bottom-4 left-4 z-30 w-12 h-12 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:bg-primary-light transition-colors"
        aria-label="Buka menu"
      >
        <PanelRightClose className="w-5 h-5" />
      </button>

      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div
        className={`md:hidden fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl transition-transform duration-300 ease-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-2 text-text-light hover:text-primary rounded-lg hover:bg-gray-100 transition-colors"
            >
              <PanelRightOpen className="w-5 h-5" />
            </button>
          </div>
          <SidebarContent collapsed={false} />
        </div>
      </div>
    </>
  );
}
