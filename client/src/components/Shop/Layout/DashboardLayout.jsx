import React from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardSideBar from "./DashboardSideBar";

// h-screen + overflow-hidden on the shell, with each column scrolling independently,
// is what actually confines scrolling to the sidebar/content — a sidebar that's merely
// `sticky` inside a page with no height ceiling just lets scroll-over-the-sidebar
// scroll the whole page instead, which is the bug this replaces.
const DashboardLayout = ({ active, children }) => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <DashboardHeader />
      <div className="flex flex-1 min-h-0">
        <div className="w-[80px] 800px:w-[330px] h-full overflow-y-auto shrink-0">
          <DashboardSideBar active={active} />
        </div>
        <div className="flex-1 h-full overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
