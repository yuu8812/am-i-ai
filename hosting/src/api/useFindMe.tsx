import { ClientInferResponseBody } from "@ts-rest/core";
import CONTRACT from "src/__generate/rest";
import { client } from "src/client";
import useSWR from "swr";

const useFindMe = () => {
  const { data, error, isLoading, mutate } = useSWR(
    CONTRACT.USERS.getUser.path,
    () => client.USERS.getUser()
  );

  const typedData = data?.body as
    | ClientInferResponseBody<typeof CONTRACT.USERS.getUser, 200>
    | undefined;

  return { data: typedData, error, isLoading, mutate };
};

export default useFindMe;
