import { ClientInferResponseBody } from "@ts-rest/core";
import CONTRACT from "src/__generate/rest";
import { client } from "src/client";
import useSWR from "swr";

export type GetAnswersResponse = ClientInferResponseBody<
  typeof CONTRACT.GAMES.getAnswers,
  200
>;

const useGetAnswers = (gameUserId: string) => {
  const { data, error, isLoading } = useSWR(
    `${CONTRACT.GAMES.getAnswers.path}/${gameUserId}`,
    () =>
      client.GAMES.getAnswers({
        params: {
          gameUserId: gameUserId,
        },
      })
  );

  const typedData = data?.body as GetAnswersResponse | undefined;

  return { data: typedData, error, isLoading };
};

export default useGetAnswers;
