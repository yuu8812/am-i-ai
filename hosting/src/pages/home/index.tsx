import { Suspense, lazy } from "react";
import DefaultMeta from "src/component/meta/DefaultMeta";
import Skeleton from "src/component/Skeleton";

const Home = lazy(async () => {
  return import("src/pages/home/Home");
});

const LazyHome = () => {
  return (
    <>
      <DefaultMeta
        title="Am-I-Ai / Home"
        name="Am-I-Ai / Home"
        content="This is Am-I-Ai Home page"
      />
      <Suspense fallback={<Skeleton />}>
        <Home />
      </Suspense>
    </>
  );
};

export default LazyHome;
