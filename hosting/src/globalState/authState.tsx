import { useCallback } from "react";
import { atom, useRecoilState } from "recoil";

export const AUTH_STATE_KEY = "authState";

export const authState = atom<string | null>({
  key: AUTH_STATE_KEY,
  default: null,
});

export const useAuthState = () => {
  const [state, setAuthState] = useRecoilState(authState);
  const setAuth = useCallback(
    (auth: any) => {
      setAuthState(JSON.stringify(auth));
    },
    [setAuthState]
  );
  return { state, setAuth };
};
