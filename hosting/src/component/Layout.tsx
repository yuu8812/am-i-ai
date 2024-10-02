import { Outlet } from "react-router-dom";
import Footer from "src/component/Footer";
import NavBar from "src/component/NavBar";
import NavBarForMobile from "src/component/NavBarForMobile";
import Skeleton from "src/component/Skeleton";
import { useAuthState } from "src/globalState/authState";

const Layout = () => {
  const { state } = useAuthState();

  return (
    <div className="flex flex-1 flex-col bg-gradient-to-br from-blue-900 to-zinc-900">
      <div className="flex flex-1 lg:flex-row flex-col">
        <NavBar />
        <NavBarForMobile />
        <div className="flex flex-col flex-1 flex-shrink-0">
          <div className="flex flex-1 flex-col min-h-screen">
            {!!state ? (
              <div className="lg:p-4 p-2 flex flex-1">
                <Outlet />
              </div>
            ) : (
              <Skeleton />
            )}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout;
