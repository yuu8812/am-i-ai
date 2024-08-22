import { client } from "src/client";

const useCreateUser = () => {
  const createUser = async () => {
    const res = await client.USERS.createUser({ body: { name: "aa" } });
    return res;
  };

  return { createUser };
};

export default useCreateUser;
