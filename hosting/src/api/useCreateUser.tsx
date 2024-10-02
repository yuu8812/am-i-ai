import { client } from "src/client";

const useCreateUser = () => {
  const createUser = async ({ name }: { name: string }) => {
    const res = await client.USERS.createUser({ body: { name } });
    return res;
  };

  return { createUser };
};

export default useCreateUser;
