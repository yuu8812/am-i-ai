import "./App.css";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import AuthProvider from "./auth/AuthProvider";
import { AnimatePresence } from "framer-motion";
import LazyHome from "src/pages/home";
import { RecoilRoot } from "recoil";
import Layout from "src/component/Layout";
import GlobalLayout from "src/component/GlobalLayout";
import LazySolo from "src/pages/game";

const Router = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<Layout />}>
          <Route index element={<LazyHome />} />
          <Route path="game">
            <Route path="solo" element={<LazySolo />} />
            <Route path="multi" element={<Link to="/">home</Link>} />
            <Route path="setting" element={<Link to="/">home</Link>} />
          </Route>
        </Route>
        <Route path="*" element={<Link to="/">not found</Link>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <GlobalLayout>
      <RecoilRoot>
        <AuthProvider>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </AuthProvider>
      </RecoilRoot>
    </GlobalLayout>
  );
};

export default App;
