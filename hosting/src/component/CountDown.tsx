import React, { memo, useCallback, useEffect, useMemo } from "react";

const CountDown = memo(
  ({
    date,
    onEnd,
    onBeforeEnd,
  }: {
    date: Date;
    onEnd?: () => void;
    onBeforeEnd?: () => void;
  }) => {
    const memoedDate = useMemo(() => date, [date]);

    const calculateTimeLeft = useCallback(
      () => Math.max(Math.floor((memoedDate.getTime() - Date.now()) / 1000), 0),
      [memoedDate]
    );

    const [count, setCount] = React.useState<number>(calculateTimeLeft());

    useEffect(() => {
      const updateCount = () => {
        setCount(calculateTimeLeft());
      };

      const interval = setInterval(() => {
        if (count <= 0) {
          clearInterval(interval);
          onEnd && onEnd();
          return;
        }
        if (count === 1) {
          onBeforeEnd && onBeforeEnd();
        }
        updateCount();
      }, 1000);

      // 初回の即時実行
      updateCount();

      // クリーンアップ関数
      return () => clearInterval(interval);
    }, [calculateTimeLeft, count, onEnd, onBeforeEnd]);

    return (
      <div className="min-w-[6px] flex items-center justify-center">
        {count}
      </div>
    );
  }
);

CountDown.displayName = "CountDown";

export default CountDown;
