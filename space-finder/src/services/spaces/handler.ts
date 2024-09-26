import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { captureAWSClient } from "aws-xray-sdk-core";
import { addCorsHeader, JSONParseError } from "../shared/utils";
import { MissingFieldError } from "../shared/validators";
import { deleteSpaces } from "./delete-spaces";
import { getSpaces } from "./get-spaces";
import { postSpace } from "./post-spaces";
import { updateSpace } from "./update-spaces";

const dbClient = captureAWSClient(new DynamoDBClient({}));
const dbDocumentClient = DynamoDBDocumentClient.from(dbClient);

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  let response: APIGatewayProxyResult;
  try {
    switch (event.httpMethod) {
      case "GET":
        const getResponse = await getSpaces(event, dbDocumentClient);
        response = getResponse;
        break;
      case "POST":
        const postResponse = await postSpace(event, dbDocumentClient);
        response = postResponse;
        break;
      case "PUT":
        const putResponse = await updateSpace(event, dbDocumentClient);
        response = putResponse;
        break;
      case "DELETE":
        const deleteResponse = await deleteSpaces(event, dbDocumentClient);
        response = deleteResponse;
        break;
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

  addCorsHeader(response);
  return response;
}

export { handler };
