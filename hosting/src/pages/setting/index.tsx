import { Suspense, lazy } from "react";
import Skeleton from "react-loading-skeleton";

const Setting = lazy(async () => {
  return import("src/pages/setting/Setting");
});

const LazySetting = () => {
  return (
    <Suspense fallback={<Skeleton />}>
      <Setting />
    </Suspense>
  );
};

export { LazySetting };
