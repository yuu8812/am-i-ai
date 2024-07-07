import { onAuthStateChanged } from "firebase/auth";
import React, { ReactNode, useEffect, useState } from "react";
import { auth } from "../firebase/config";
import Loading from "../component/Loading";
import { useAuthState } from "src/globalState/authState";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { setAuth } = useAuthState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const unsubscribed = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuth(user);
      } else {
        setAuth(null);
      }
      setLoading(false);
    });
    return unsubscribed;
  }, [setAuth]);

  return (
    <div className="flex flex-1">
      <div className="flex flex-1 w-screen h-screen pointer-events-none fixed top-0 left-0 z-50">
        <Loading visible={loading} />
      </div>
      {children}
    </div>
  );
};

export default AuthProvider;
