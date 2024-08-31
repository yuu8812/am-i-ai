import { ClientInferResponseBody } from "@ts-rest/core";
import CONTRACT from "src/__generate/rest";
import { client } from "src/client";
import useSWR from "swr";

export type ProgressResponse = ClientInferResponseBody<
  typeof CONTRACT.GAMES.progress,
  200
>;

const useProgress = (gameUserId: string) => {
  const { data, error, isLoading } = useSWR(
    `${CONTRACT.GAMES.progress.path}/${gameUserId}`,
    () =>
      client.GAMES.progress({
        params: {
          gameUserId: gameUserId,
        },
      }),
    {
      revalidateOnFocus: false,
    }
  );

  const typedData = data?.body as ProgressResponse | undefined;

  return { data: typedData, error, isLoading };
};

export default useProgress;
