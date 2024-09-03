import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { postSpace } from "./post-spaces";
import { getSpaces } from "./get-spaces";
import { updateSpace } from "./update-spaces";
import { deleteSpaces } from "./delete-spaces";
import { MissingFieldError } from "../shared/validators";
import { JSONParseError } from "../shared/utils";

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
      case "DELETE":
        const deleteResponse = await deleteSpaces(event, dbDocumentClient);
        return deleteResponse;
      default:
        return { statusCode: 405, body: "Method Not Allowed" };
    }
  } catch (error) {
    console.log({ error });
    if (error instanceof MissingFieldError || error instanceof JSONParseError) {
      return { statusCode: 400, body: JSON.stringify({ message: error.message }) };
    }
    return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
  }
}

export { handler };
