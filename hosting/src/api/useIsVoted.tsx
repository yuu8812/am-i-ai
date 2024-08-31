import { ClientInferResponseBody } from "@ts-rest/core";
import CONTRACT from "src/__generate/rest";
import { client } from "src/client";
import useSWR from "swr";

export type IsVotedResponse = ClientInferResponseBody<
  typeof CONTRACT.GAMES.isVoted,
  200
>;

const useIsVoted = (gameUserId: string) => {
  const { data, error, isLoading } = useSWR(
    `${CONTRACT.GAMES.isVoted.path}/${gameUserId}`,
    () =>
      client.GAMES.isVoted({
        params: {
          gameUserId: gameUserId,
        },
      })
  );

  const typedData = data?.body as IsVotedResponse | undefined;

  return { data: typedData, error, isLoading };
};

export default useIsVoted;
