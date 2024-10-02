import { Suspense, lazy } from "react";
import Skeleton from "react-loading-skeleton";
import DefaultMeta from "src/component/meta/DefaultMeta";

const Login = lazy(async () => {
  return import("src/pages/login/Login");
});

const LazyLogin = () => {
  return (
    <>
      <DefaultMeta
        title="Am-I-Ai / Login"
        name="Am-I-Ai / Login"
        content="This is Am-I-Ai login page"
      />
      <Suspense fallback={<Skeleton />}>
        <Login />
      </Suspense>
    </>
  );
};

export { LazyLogin };
