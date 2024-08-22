// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios, { AxiosError, Method } from "axios";
import { initClient } from "@ts-rest/core";
import CONTRACT from "src/__generate/rest";
import { auth } from "src/firebase/config";

export const client = initClient(CONTRACT, {
  baseUrl: "",
  baseHeaders: {
    "Content-Type": "application/json",
  },
  api: async ({ path, method, headers, body }) => {
    const idToken = await auth.currentUser?.getIdToken();
    try {
      const result = await axios.request({
        method: method as Method,
        url: `${process.env.REACT_APP_BACKEND_URL}${path}`,
        headers: {
          ...headers,
          Authorization: `Bearer ${idToken}`,
        },
        data: body,
      });
      return {
        status: result.status,
        body: result.data,
        headers: result.headers as unknown as Headers,
      };
    } catch (e: Error | AxiosError | any) {
      throw e;
    }
  },
});
