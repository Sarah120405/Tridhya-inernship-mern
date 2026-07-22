import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

function Layout() {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
      <div className="flex flex-col flex-1 min-w-0">
        <Navbar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export { Layout };
