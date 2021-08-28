import SidebarContent from "./sidebarContent";

const DesktopSidebar = (props) => {
  return (
    <aside className="z-30 flex-shrink-0 hidden w-48 overflow-y-auto bg-white dark:bg-gray-800 lg:block">
      <SidebarContent />
    </aside>
  );
};

export default DesktopSidebar;
