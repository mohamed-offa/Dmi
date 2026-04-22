import { Outlet } from "react-router";

export function Layout() {
  return (
    <div className="w-full min-h-screen bg-[#0a0f1c] text-slate-200">
      <Outlet />
    </div>
  );
}
