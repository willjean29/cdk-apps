import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { postSpace } from "./post-spaces";
import { getSpaces } from "./get-spaces";
import { updateSpace } from "./update-spaces";

const dbClient = new DynamoDBClient({});
const dbDocumentClient = DynamoDBDocumentClient.from(dbClient);

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  try {
    switch (event.httpMethod) {
      case "GET":
        const getResponse = await getSpaces(event, dbDocumentClient);
        return getResponse;
      case "POST":
        const postResponse = await postSpace(event, dbDocumentClient);
        return postResponse;
      case "PUT":
        const putResponse = await updateSpace(event, dbDocumentClient);
        return putResponse;
      default:
        return { statusCode: 405, body: "Method Not Allowed" };
    }
  } catch (error) {
    console.log({ error });
    return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
  }
}

export { handler };
