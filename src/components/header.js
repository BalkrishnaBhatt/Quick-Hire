import { useState } from "react";
import { Avatar } from "@windmill/react-ui";
import { OutlineLogoutIcon } from "icons";
import { useHistory } from "react-router-dom";

const Header = (props) => {
  const [showLogout, setShowLogout] = useState(false);
  const history = useHistory();
  return (
    <header className="z-40 py-4 bg-white shadow-bottom">
      <div className="container flex items-center h-full px-6 mx-auto text-purple-600 dark:text-purple-300 justify-end">
        <ul className="flex items-center flex-shrink-0 space-x-6">
          <li className="relative flex flex-row justify-around">
            <div
              className="hover:bg-gray-100 rounded-full px-2 py-1 cursor-pointer"
              onClick={() => history.push("/home/account")}
            >
              <span className="text-gray-400 text-sm mr-2 pt-2 hover:font-bold">
                Manager 1
              </span>
              <Avatar
                className="align-middle"
                src="https://images.unsplash.com/photo-1502378735452-bc7d86632805?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=aa3a807e1bbdfd4364d1f449eaa96d82"
                alt=""
                aria-hidden="true"
              />
            </div>
          </li>
          <li
            className="relative flex flex-row  cursor-pointer"
            onClick={() => history.push("/login")}
            onMouseOver={() => setShowLogout(true)}
            onMouseLeave={() => setShowLogout(false)}
          >
            <span
              className={`${
                showLogout ? "" : "hidden"
              } text-sm mr-2 text-gray-400`}
            >
              logout
            </span>
            <OutlineLogoutIcon className="h-5 w-5 text-gray-400 " />
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
