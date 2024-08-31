import { ClientInferResponseBody } from "@ts-rest/core";
import CONTRACT from "src/__generate/rest";
import { client } from "src/client";
import useSWR from "swr";

export type GetIsAnsweredResponse = ClientInferResponseBody<
  typeof CONTRACT.GAMES.isAnswered,
  200
>;

const fetcher = async ({
  gameUserId,
  questionId,
}: {
  gameUserId: string;
  questionId: string | undefined;
}) => {
  if (!questionId || !gameUserId) return;
  const res = await client.GAMES.isAnswered({
    params: {
      gameUserId,
    },
    query: {
      questionId,
    },
  });
  return res;
};

const useIsAnswered = ({
  gameUserId,
  questionId,
}: {
  gameUserId: string;
  questionId: string | undefined;
}) => {
  const { data, error, isLoading, mutate } = useSWR(
    `${CONTRACT.GAMES.isAnswered.path}/${gameUserId}?questionId=${questionId}`,
    () => fetcher({ gameUserId, questionId })
  );

  const typedData = data?.body as GetIsAnsweredResponse | undefined;

  return { data: typedData, error, isLoading, mutate };
};

export default useIsAnswered;
