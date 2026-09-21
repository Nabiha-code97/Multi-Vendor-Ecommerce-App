import React, { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardSideBar from "./DashboardSideBar";

// h-screen + overflow-hidden on the shell, with each column scrolling independently,
// is what actually confines scrolling to the sidebar/content — a sidebar that's merely
// `sticky` inside a page with no height ceiling just lets scroll-over-the-sidebar
// scroll the whole page instead, which is the bug this replaces.
const DashboardLayout = ({ active, children }) => {
  // manual collapse only applies at/above 800px — below it the sidebar is
  // always the icon-only rail regardless of this state
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <DashboardHeader />
      <div className="flex flex-1 min-h-0">
        <div
          className={`h-full overflow-y-auto shrink-0 transition-[width] duration-200 ${
            collapsed ? "w-[80px]" : "w-[80px] 800px:w-[330px]"
          }`}
        >
          <DashboardSideBar active={active} collapsed={collapsed} onToggleCollapse={() => setCollapsed((c) => !c)} />
        </div>
        <div className="flex-1 h-full overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
