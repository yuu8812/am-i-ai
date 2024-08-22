import { ClientInferResponseBody } from "@ts-rest/core";
import CONTRACT from "src/__generate/rest";
import { client } from "src/client";

const useStartGame = () => {
  const startGame = async () => {
    const res = await client.GAMES.startGame();
    const typedData = res?.body as
      | ClientInferResponseBody<typeof CONTRACT.GAMES.startGame, 201>
      | undefined;
    return typedData;
  };

  return { startGame };
};

export default useStartGame;
