import { NavLink, useLocation } from "react-router-dom";
import * as Icons from "icons";

const routes = [
  { name: "Jobs", path: "/home/jobs", icon: "BriefcaseIcon" },
  { name: "Talents", path: "/home/talents", icon: "UserCircleIcon" },
  { name: "Matching", path: "/home/matching", icon: "Clipboard" },
];

const Icon = ({ icon, ...props }) => {
  const Icon = Icons[icon];
  return <Icon {...props} className="h-5 w-5" />;
};

const SidebarContent = (props) => {
  const location = useLocation();
  const currentLoc = location.pathname;
  return (
    <div className="py-10">
      <div className="text-center">
        <NavLink
          to="/home/jobs"
          className="text-lg font-semibold blue text-center"
        >
          SUPERECRUITER
        </NavLink>
      </div>
      <ul className="mt-6">
        {routes.map((route, index) => {
          let active = currentLoc.includes(route.path);
          return (
            <li className="relative px-6 py-3" key={index}>
              <NavLink
                exact
                to={route.path}
                className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                activeClassName="text-gray-800 dark:text-gray-100"
              >
                {active && (
                  <>
                    <span
                      className="absolute inset-y-0 left-0 w-1  bg-blue rounded-tr-lg rounded-br-lg"
                      aria-hidden="true"
                    ></span>
                    <span
                      className="absolute inset-y-0 left-0 w-1 bg-blue rounded-tr-lg rounded-br-lg"
                      aria-hidden="true"
                    ></span>
                  </>
                )}
                <Icon
                  className={`w-5 h-5 ${
                    active ? "text-gray-500" : "text-gray-400"
                  }`}
                  aria-hidden="true"
                  icon={route.icon}
                />
                <span
                  className={`ml-4 ${
                    active ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {route.name}
                </span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SidebarContent;
