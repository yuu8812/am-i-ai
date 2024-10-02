import { client } from "src/client";

const useEditUser = () => {
  const editUser = async ({ name }: { name: string }) => {
    const res = await client.USERS.editUser({ body: { name } });
    return res;
  };

  return { editUser };
};

export default useEditUser;
