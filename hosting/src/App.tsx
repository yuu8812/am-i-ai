import "./App.css";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import AuthProvider from "./auth/AuthProvider";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-screen w-screen flex flex-1 flex-row bg-blue-100">
      {children}
    </div>
  );
};

const PrivateLayout = () => {
  return (
    <div className="h-screen w-screen flex flex-1 flex-row bg-red-100">
      <h1>PrivateLayout</h1>
      <Outlet />
    </div>
  );
};

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateLayout />}>
          <Route path="/" element={<div>Home</div>} />
          <Route path="about" element={<div>About</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <Layout>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </Layout>
  );
};

export default App;
