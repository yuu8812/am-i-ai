import { NavLink, useNavigate } from "react-router-dom";
import { MdHome } from "react-icons/md";
import { MdSettings } from "react-icons/md";

import MultiIcon from "src/component/MultiIcon";
import { auth } from "src/firebase/config";
import { FaSignOutAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import { useRef, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { set } from "zod";

export const NAV_BAR_PATH_INFO_ARRAY = [
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

const NavBarForMobile = () => {
  const [hide, setHide] = useState(true);
  const navigate = useNavigate();
  const me = !!auth?.currentUser;
  const handleSignOut = async () => {
    if (!auth.currentUser) return;
    await auth.signOut().catch((e) => {
      toast.error("SignOut Failed");
    });
    navigate("/");
    toast.success("SignOut Succeed");
  };
  return (
    <div className="flex flex-col lg:hidden">
      <button
        className="p-4"
        onClick={(e) => {
          setHide(false);
        }}
        onBlur={() => setHide(true)}
        tabIndex={1}
      >
        <AiOutlineMenu size={32} />
        <div className={`w-1/2 z-40 left-0 top-0 ${hide ? "hidden" : "fixed"}`}>
          <div className="p-2 flex flex-1 flex-col fixed h-screen bg-gray-800 shadow-lg shadow-black w-1/2 justify-between">
            <div>
              <div className="p-2 text-lg font-bold text-white flex items-center gap-2">
                <img src="/base.png" height={40} width={40} alt="icon" />
                AmIAi
              </div>
              <div className="mt-8 p-1 flex flex-col gap-2 text-sm transition-all">
                {NAV_BAR_PATH_INFO_ARRAY.map((pathInfo) => {
                  return (
                    <NavLink
                      onMouseDown={(e) => e.preventDefault()}
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
            {me && (
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
            )}
          </div>
        </div>
      </button>
    </div>
  );
};

export default NavBarForMobile;
