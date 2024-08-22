import { ClientInferResponseBody } from "@ts-rest/core";
import CONTRACT from "src/__generate/rest";
import useFindMe from "src/api/useFindMe";
import { client } from "src/client";
import useSWR from "swr";

export type HealthCheckResponse = ClientInferResponseBody<
  typeof CONTRACT.GAMES.healthCheck,
  200
>;

const useHealthCheck = (gameUserId: string) => {
  const { data, error, isLoading } = useSWR(
    CONTRACT.GAMES.healthCheck.path,
    () =>
      client.GAMES.healthCheck({
        params: {
          gameUserId: gameUserId,
        },
      }),
    {
      // 1秒
      refreshInterval: 1000,
      refreshWhenHidden: true,
      fallbackData: undefined,
    }
  );

  const { data: me } = useFindMe();

  const typedData = data?.body as HealthCheckResponse | undefined;

  const sortedData = typedData?.gameUsers.sort((a, b) => {
    if (a.id === me?.id) return -1;
    if (b.id === me?.id) return 1;
    return 0;
  });

  return {
    data: {
      ...typedData,
      gameUsers: sortedData,
    },
    error,
    isLoading,
  };
};

export default useHealthCheck;
