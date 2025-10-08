"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Star,
  Image,
  FolderOpen,
  Settings,
  BarChart3,
  Users,
  Menu,
  X,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: FolderOpen,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    name: "Reviews",
    href: "/admin/reviews",
    icon: Star,
  },
  {
    name: "Carousel",
    href: "/admin/carousel",
    icon: Image,
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <div
          className={cn(
            "fixed inset-0 z-50 bg-gray-900/80",
            sidebarOpen ? "block" : "hidden"
          )}
          onClick={() => setSidebarOpen(false)}
        />
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-md border-r border-white/30 shadow-2xl transform transition-transform duration-300 ease-in-out",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-full flex-col">
            <div className="flex h-20 items-center justify-between px-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">LH</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h1 className="text-xl font-bold text-slate-900">
                    LeadHer Admin
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">
                    Dashboard
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 px-4 py-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-3 py-3 text-sm font-semibold rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25"
                        : "text-slate-700 hover:text-purple-600 hover:bg-white/60 hover:shadow-md"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0",
                        isActive
                          ? "text-white"
                          : "text-slate-400 group-hover:text-purple-500"
                      )}
                    />
                    {item.name}
                    {isActive && (
                      <div className="ml-auto h-2 w-2 bg-white/60 rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Sidebar Footer */}
            <div className="p-4 bg-gradient-to-r from-slate-50 to-blue-50 border-t border-white/50">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">?</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-700">
                    Need Help?
                  </p>
                  <p className="text-xs text-slate-500">Check our docs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white/80 backdrop-blur-md border-r border-white/30 px-6 pb-4 shadow-2xl">
          <div className="flex h-20 shrink-0 items-center">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">LH</span>
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-bold text-slate-900">
                  LeadHer Admin
                </h1>
                <p className="text-xs text-slate-500 font-medium">Dashboard</p>
              </div>
            </div>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-2">
              <li>
                <ul role="list" className="space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            "group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-semibold transition-all duration-200",
                            isActive
                              ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25"
                              : "text-slate-700 hover:text-purple-600 hover:bg-white/60 hover:shadow-md"
                          )}
                        >
                          <item.icon
                            className={cn(
                              "h-5 w-5 shrink-0",
                              isActive
                                ? "text-white"
                                : "text-slate-400 group-hover:text-purple-500"
                            )}
                          />
                          <span className="truncate">{item.name}</span>
                          {isActive && (
                            <div className="ml-auto h-2 w-2 bg-white/60 rounded-full"></div>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="mt-auto mb-4 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl border border-white/50">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">?</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700">
                  Need Help?
                </p>
                <p className="text-xs text-slate-500">Check our docs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
          LeadHer Admin
        </div>
      </div>
    </>
  );
}
