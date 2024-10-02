import React, { lazy, Suspense } from "react";

const RateChart = lazy(() => import("./RateChart"));

export const LazyRateChart = ({
  data,
}: {
  data: {
    humanNess: number[];
    humanDetect: number[];
    dates: Date[];
  };
}) => {
  return (
    <Suspense fallback={<div></div>}>
      <RateChart data={data} />
    </Suspense>
  );
};
