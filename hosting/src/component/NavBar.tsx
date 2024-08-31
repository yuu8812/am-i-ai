import { NavLink } from "react-router-dom";
import { MdHome } from "react-icons/md";
import { MdSettings } from "react-icons/md";

import MultiIcon from "src/component/MultiIcon";

const NAV_BAR_PATH_INFO_ARRAY = [
  {
    route: "/",
    text: "Home",
    Icon: <MdHome size={20} />,
  },
  // {
  //   route: "/game/solo",
  //   text: "Solo",
  //   Icon: <MdOutlineSentimentSatisfied size={20} />,
  // },
  {
    route: "/game/multi",
    text: "Game",
    Icon: <MultiIcon />,
  },
  {
    route: "/game/setting",
    text: "Setting",
    Icon: <MdSettings size={20} />,
  },
];

const NavBar = () => {
  return (
    <div className="w-40 z-40 flex">
      <div className="p-2 flex flex-1 flex-col fixed h-screen bg-gray-800 shadow-lg shadow-black w-40">
        <div className="p-2 text-lg font-bold text-white">AmIAi</div>
        <div className="mt-8 p-1 flex flex-col gap-2 text-sm transition-all">
          {NAV_BAR_PATH_INFO_ARRAY.map((pathInfo) => {
            return (
              <NavLink
                key={pathInfo.route}
                to={pathInfo.route}
                className={({ isActive }) =>
                  `relative w-full px-4 py-3 shadow-2xl shadow-red-600 transition-all duration-300 gap-2 flex items-center hover:scale-105 ${
                    isActive
                      ? "text-white bg-gradient-to-r from-red-500 to-red-700"
                      : "text-black bg-white border-transparent hover:border-red-500"
                  }`
                }
              >
                {pathInfo.Icon && (
                  <div className="text-xl">{pathInfo.Icon}</div>
                )}
                <div className="mx-2">{pathInfo.text}</div>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
