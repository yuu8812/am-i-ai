import React, { useState } from "react";

const Switcher = () => {
  const [mode, setMode] = useState<"ai" | "human">("ai");

  return <div>Switcher</div>;
};

export default Switcher;
