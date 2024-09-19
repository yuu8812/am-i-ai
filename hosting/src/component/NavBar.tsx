import { NavLink, useNavigate } from "react-router-dom";
import { MdHome } from "react-icons/md";
import { MdSettings } from "react-icons/md";

import MultiIcon from "src/component/MultiIcon";
import { auth } from "src/firebase/config";
import { FaSignOutAlt } from "react-icons/fa";

const NAV_BAR_PATH_INFO_ARRAY = [
  {
    route: "/",
    text: "Home",
    Icon: <MdHome size={20} />,
  },
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
  const navigate = useNavigate();
  const handleSignOut = async () => {
    await auth.signOut();
    navigate("/");
  };
  return (
    <div className="w-40 z-40 flex">
      <div className="p-2 flex flex-1 flex-col fixed h-screen bg-gray-800 shadow-lg shadow-black w-40 justify-between">
        <div>
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
        <div className="py-2">
          <div
            className="mx-2 cursor-pointer bg-white p-3 text-sm hover:scale-105 transition-all"
            onClick={handleSignOut}
          >
            <div className="flex items-center gap-4">
              <FaSignOutAlt size={12} />
              SignOut
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
