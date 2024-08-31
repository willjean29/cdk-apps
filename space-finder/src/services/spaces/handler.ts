import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { postSpace } from "./post";
const dbClient = new DynamoDBClient({});

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  let message: string;
  try {
    switch (event.httpMethod) {
      case "GET":
        message = "GET method";
        break;
      case "POST":
        const response = await postSpace(event, dbClient);
        return response;
        break;
      default:
        return { statusCode: 405, body: "Method Not Allowed" };
    }
  } catch (error) {
    console.log({ error });
    return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify({ message }),
  };
  console.log({ event });
  return response;
}

export { handler };
