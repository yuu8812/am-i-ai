import { initClient } from "@ts-rest/core";
import CONTRACT from "../__generate/rest";

export const client = initClient(CONTRACT, {
  baseUrl: "http://localhost:4000",
  baseHeaders: {},
});
