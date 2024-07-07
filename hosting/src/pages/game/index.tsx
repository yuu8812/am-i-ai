import { Suspense, lazy } from "react";
import Skeleton from "src/component/Skeleton";

const Solo = lazy(async () => {
  return import("src/pages/game/Solo");
});

const Multi = lazy(async () => {
  return import("src/pages/game/Multi");
});

const LazySolo = () => {
  return (
    <Suspense fallback={<Skeleton />}>
      <Solo />
    </Suspense>
  );
};

const LazyMulti = () => {
  return (
    <Suspense fallback={<Skeleton />}>
      <Multi />
    </Suspense>
  );
};

export { LazySolo, LazyMulti };
