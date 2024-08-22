import { ClientInferResponseBody } from "@ts-rest/core";
import CONTRACT from "src/__generate/rest";
import { client } from "src/client";
import useSWR from "swr";

const useOnlineCheck = () => {
  const { data, isLoading } = useSWR(
    CONTRACT.USERS.onlineCheck.path,
    client.USERS.onlineCheck,
    {
      //10秒
      refreshInterval: 10000,
    }
  );

  const typedData = data?.body as
    | ClientInferResponseBody<typeof CONTRACT.USERS.onlineCheck, 201>
    | undefined;

  return { data: typedData, isLoading };
};

export default useOnlineCheck;
