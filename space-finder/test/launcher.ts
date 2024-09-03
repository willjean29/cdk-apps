// import { handler } from "../src/services/hello";
import { handler } from "../src/services/spaces/handler";

handler(
  {
    httpMethod: "PUT",
    queryStringParameters: { id: "2d39495a-99a1-4d3d-a2bb-7e055c57dca5" },
    body: JSON.stringify({ location: "Lima" }),
  } as any,
  {} as any
);
