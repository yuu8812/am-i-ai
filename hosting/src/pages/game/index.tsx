import { Suspense, lazy } from "react";

const Solo = lazy(async () => {
  return import("src/pages/game/Solo");
});

const Multi = lazy(async () => {
  return import("src/pages/game/Multi");
});

const MultiPlay = lazy(async () => {
  return import("src/pages/game/MultiPlay");
});

const Wait = lazy(async () => {
  return import("src/pages/game/Wait");
});

const Vote = lazy(async () => {
  return import("src/pages/game/Vote");
});

const Result = lazy(async () => {
  return import("src/pages/game/Result");
});

const LazySolo = () => {
  return (
    <Suspense fallback={<div />}>
      <Solo />
    </Suspense>
  );
};

const LazyMulti = () => {
  return (
    <Suspense fallback={<div />}>
      <Multi />
    </Suspense>
  );
};

const LazyMultiPlay = () => {
  return (
    <Suspense fallback={<div />}>
      <MultiPlay />
    </Suspense>
  );
};

const LazyWait = () => {
  return (
    <Suspense fallback={<div />}>
      <Wait />
    </Suspense>
  );
};

const LazyVote = () => {
  return (
    <Suspense fallback={<div />}>
      <Vote />
    </Suspense>
  );
};

const LazyResult = () => {
  return (
    <Suspense fallback={<div />}>
      <Result />
    </Suspense>
  );
};

export { LazySolo, LazyMulti, LazyMultiPlay, LazyWait, LazyVote, LazyResult };
