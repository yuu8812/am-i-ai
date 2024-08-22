import { useState, useEffect } from "react";

const Counter = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="text-white text-2xl">
      {count}
      <span className="pl-2 text-sm">second left</span>
    </div>
  );
};

export default Counter;
