import { Suspense, lazy } from "react";
import DefaultMeta from "src/component/meta/DefaultMeta";

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
    <>
      <DefaultMeta
        title="Am-I-Ai / Game"
        name="Am-I-Ai / Game"
        content="This is Am-I-Ai Game page"
      />
      <Suspense fallback={<div />}>
        <Multi />
      </Suspense>
    </>
  );
};

const LazyMultiPlay = () => {
  return (
    <>
      <DefaultMeta
        title="Am-I-Ai / Playing"
        name="Am-I-Ai / Playing"
        content="This is Am-I-Ai Playing page"
      />
      <Suspense fallback={<div />}>
        <MultiPlay />
      </Suspense>
    </>
  );
};

const LazyWait = () => {
  return (
    <>
      <DefaultMeta
        title="Am-I-Ai / Waiting"
        name="Am-I-Ai / Waiting"
        content="This is Am-I-Ai Waiting page"
      />
      <Suspense fallback={<div />}>
        <Wait />
      </Suspense>
    </>
  );
};

const LazyVote = () => {
  return (
    <>
      <DefaultMeta
        title="Am-I-Ai / Vote"
        name="Am-I-Ai / Vote"
        content="This is Am-I-Ai Vote page"
      />
      <Suspense fallback={<div />}>
        <Vote />
      </Suspense>
    </>
  );
};

const LazyResult = () => {
  return (
    <>
      <DefaultMeta
        title="Am-I-Ai / Result"
        name="Am-I-Ai / Result"
        content="This is Am-I-Ai Result page"
      />
      <Suspense fallback={<div />}>
        <Result />
      </Suspense>
    </>
  );
};

export { LazySolo, LazyMulti, LazyMultiPlay, LazyWait, LazyVote, LazyResult };
