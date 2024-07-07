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
import { LazyMulti, LazySolo } from "src/pages/game";
import { LazySetting } from "src/pages/setting";
import { Suspense } from "react";

const Router = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<Layout />}>
          <Route index element={<LazyHome />} />
          <Route path="game">
            <Route path="solo">
              <Route index element={<LazySolo />} />
              <Route path=":id" element={<LazySolo />} />
            </Route>
            <Route path="multi">
              <Route index element={<LazyMulti />} />
              <Route path=":id" element={<LazyMulti />} />
            </Route>
            <Route path="multi" element={<Link to="/">home</Link>} />
            <Route path="setting" element={<LazySetting />} />
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
            <Suspense fallback={<div>Loading...</div>}>
              <Router />
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </RecoilRoot>
    </GlobalLayout>
  );
};

export default App;
