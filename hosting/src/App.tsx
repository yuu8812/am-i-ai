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
import { LazyMulti, LazyMultiPlay, LazyVote, LazyWait } from "src/pages/game";
import { LazySetting } from "src/pages/setting";
import { Suspense } from "react";
import Skeleton from "src/component/Skeleton";

const Router = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<Layout />}>
          <Route index element={<LazyHome />} />
          <Route path="game">
            <Route path="multi">
              <Route index element={<LazyMulti />} />
              <Route path=":gameUserId">
                <Route path="" element={<LazyMultiPlay />} />
                <Route path="vote" element={<LazyVote />} />
              </Route>
              <Route path="waiting/:waitingUserId" element={<LazyWait />} />
            </Route>
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
            <Suspense fallback={<Skeleton />}>
              <Router />
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </RecoilRoot>
    </GlobalLayout>
  );
};

export default App;
