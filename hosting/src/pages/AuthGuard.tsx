import React from "react";
import { Outlet } from "react-router-dom";
import Transition from "src/animate/Transition";
import useFindMe from "src/api/useFindMe";
import Unauthorized from "src/component/Unauthorized";

const AuthGuard = () => {
  const { data, error, isLoading } = useFindMe();
  if (isLoading) return null;
  if (!data || error)
    return (
      <Transition>
        <Unauthorized />
      </Transition>
    );
  return <Outlet />;
};

export default AuthGuard;
