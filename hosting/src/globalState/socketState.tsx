import { atom, useRecoilState } from "recoil";
import { Socket } from "socket.io-client";
import { initializeSocket } from "src/socketClient";

export const SOCKET_STATE_KEY = "socketState";

export const socketState = atom<Socket>({
  key: SOCKET_STATE_KEY,
  default: initializeSocket(),
  dangerouslyAllowMutability: true,
});

export const useSocketState = () => {
  const [state] = useRecoilState(socketState);
  return { state };
};
