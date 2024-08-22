import { ClientInferResponseBody } from "@ts-rest/core";
import CONTRACT from "src/__generate/rest";
import { client } from "src/client";
import useSWR from "swr";

const useMatching = ({
  onErr,
  waitingUserId,
}: {
  onErr?: () => void;
  waitingUserId: string;
}) => {
  const { data, error } = useSWR(
    CONTRACT.GAMES.matching.path + "/" + waitingUserId,
    () =>
      client.GAMES.matching({
        params: {
          waitingUserId,
        },
      }),
    // 1秒ごとに再取得
    {
      refreshInterval: 1000,
      onError: onErr,
      refreshWhenHidden: true,
      fallbackData: undefined,
    }
  );

  const typedData = data?.body as
    | ClientInferResponseBody<typeof CONTRACT.GAMES.matching, 200>
    | undefined;

  return { data: typedData, error };
};

export default useMatching;
