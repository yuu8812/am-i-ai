import { Suspense, lazy } from "react";
import Skeleton from "src/component/Skeleton";

const Solo = lazy(async () => {
  return import("src/pages/game/Solo");
});

const LazySolo = () => {
  return (
    <Suspense fallback={<Skeleton />}>
      <Solo />
    </Suspense>
  );
};

export default LazySolo;
