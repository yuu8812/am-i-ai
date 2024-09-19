import { ClientInferResponseBody } from "@ts-rest/core";
import CONTRACT from "src/__generate/rest";
import { client } from "src/client";
import useSWR from "swr";

export type ResultResponse = ClientInferResponseBody<
  typeof CONTRACT.GAMES.result,
  200
>;

const useResult = (gameUserId: string) => {
  const { data, error, isLoading } = useSWR(
    `${CONTRACT.GAMES.result.path}/${gameUserId}`,
    () =>
      client.GAMES.result({
        params: {
          gameUserId: gameUserId,
        },
      })
  );

  const typedData = data?.body as ResultResponse | undefined;

  return { data: typedData, error, isLoading };
};

export default useResult;
