import { Suspense, lazy } from "react";
import Skeleton from "src/component/Skeleton";

const Home = lazy(async () => {
  return import("src/pages/home/Home");
});

const LazyHome = () => {
  return (
    <Suspense fallback={<Skeleton />}>
      <Home />
    </Suspense>
  );
};

export default LazyHome;
