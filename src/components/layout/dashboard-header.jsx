"use client";
import { useSidebar } from "@/components/layout/sidebar-provider";
import { FaBarsStaggered } from "react-icons/fa6";

export const DashboardHeader = () => {
  const { setSidebarOpen } = useSidebar();

  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden mr-4"
        >
          <FaBarsStaggered className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>
    </header>
  );
};
