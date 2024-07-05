import { Outlet } from "react-router-dom";
import Footer from "src/component/Footer";
import NavBar from "src/component/NavBar";
import Skeleton from "src/component/Skeleton";
import { useAuthState } from "src/globalState/authState";

const Layout = () => {
  const { state } = useAuthState();

  return (
    <div className="flex flex-1 w-screen flex-col">
      <div className="flex flex-1">
        <NavBar />
        <div className="flex flex-1 h-screen">
          <div className="p-4 flex flex-1">
            {!!state ? <Outlet /> : <Skeleton />}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
