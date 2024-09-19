import { ClientInferResponseBody } from "@ts-rest/core";
import CONTRACT from "src/__generate/rest";
import { client } from "src/client";

const useVote = () => {
  const vote = async ({
    gameUserId,
    voteTo,
  }: {
    gameUserId: string;
    voteTo: string;
  }) => {
    const res = await client.GAMES.vote({
      params: {
        gameUserId,
      },
      body: {
        voteTo,
      },
    });
    const typedData = res?.body as
      | ClientInferResponseBody<typeof CONTRACT.GAMES.vote, 201>
      | undefined;
    return typedData;
  };

  return { vote };
};

export default useVote;
