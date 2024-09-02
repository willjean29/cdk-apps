import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { postSpace } from "./post-spaces";
import { getSpaces } from "./get-spaces";

const dbClient = new DynamoDBClient({});

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  let message: string;
  try {
    switch (event.httpMethod) {
      case "GET":
        const getResponse = await getSpaces(event, dbClient);
        return getResponse;
      case "POST":
        const postResponse = await postSpace(event, dbClient);
        return postResponse;
      default:
        return { statusCode: 405, body: "Method Not Allowed" };
    }
  } catch (error) {
    console.log({ error });
    return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
  }
}

export { handler };
