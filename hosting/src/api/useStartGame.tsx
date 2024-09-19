import { ClientInferResponseBody } from "@ts-rest/core";
import CONTRACT from "src/__generate/rest";
import { client } from "src/client";

const useStartGame = () => {
  const startGame = async ({ language }: { language: "ja" | "en" }) => {
    const res = await client.GAMES.startGame({ body: { language } });
    const typedData = res?.body as
      | ClientInferResponseBody<typeof CONTRACT.GAMES.startGame, 201>
      | undefined;
    return typedData;
  };

  return { startGame };
};

export default useStartGame;
